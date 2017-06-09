import $ from "jquery";
import { generalOptions } from '../generalOtions/generalOptions';

class DataFactory{
    constructor(){
        this.servicesList = {}; //list with services names and ids, but without details
        this.servicesTrees = {}; //whole data with details
        this.allServices = [];
        this.api = (generalOptions.apiMode === 'M') ? '/api/v2/sites/order_form_data' : '/api/v2/public/calculator';

    }
    checkCoupon(coupon_code){
        return new Promise((resolve, reject) => {
            $.ajax({
                url: generalOptions.siteApiUrl + '/api/v2/order/check_coupon',
                type: 'GET',
                data: {
                    'coupon_code': coupon_code
                },
                cache: false,
                xhrFields: {
                    withCredentials: true
                },
                async: true,
                crossDomain: true,
            }).done(response => {
                generalOptions.discount_amount = JSON.parse(response).info.discount_amount;
                resolve(generalOptions.discount_amount)
            }).fail(error => {

                reject(error);
            })
        })

    }

    getData(services_ids = ''){
        let apiRequestBody = {
            'is_disciplines': false,
            'is_paper_formats': false,
            'is_services': true,
            'website_id': generalOptions.website_id,
            'service_ids':  services_ids // "1648, 1650..."
        };
        if (generalOptions.apiMode !== 'M') {
            apiRequestBody.rid = generalOptions.rid;
            apiRequestBody.website_id = 432;
        }

        return new Promise((resolve, reject) => {
            $.ajax({
                url: generalOptions.siteApiUrl + this.api,
                type: 'GET',
                data: apiRequestBody,
                cache: false,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
            }).done(response => {
                resolve(response);
            }).fail(error => reject(error))
        })
    };

    saveData(response){
        let data = JSON.parse(response);
        this.sortedData(data.info.services_tree, this.servicesTrees);
        this.dataServicesFormatting(data.info.services);
        this.saveAllServicesList();
    };


    sortedData(data, sourceObject) {
        for (let i = 0; i < data.length; i++) {
            sourceObject[data[i].name] = data[i];
        }

        for (let key in sourceObject) {
            for (let i = 0; i < sourceObject[key].level.length; i++) {

                let name = sourceObject[key].level[i].name;

                sourceObject[key].level[name] = sourceObject[key].level[i];
                delete sourceObject[key].level[i];
            }
        }
        for (let key in sourceObject) {
            for (let key2 in sourceObject[key].level) {
                if (!!(sourceObject[key].level[key2].deadline)) {
                    for (let i = 0; i < sourceObject[key].level[key2].deadline.length; i++) {
                        let name = sourceObject[key].level[key2].deadline[i].name;
                        sourceObject[key].level[key2].deadline[name] = sourceObject[key].level[key2].deadline[i];
                        delete sourceObject[key].level[key2].deadline[i];
                    }
                }
            }
        }
    };

    dataServicesFormatting(rawServicesList) {
        let data = rawServicesList;

        for (let i = 0; i < data.length; i++) {
            if (!!(this.servicesTrees[data[i].name])) {
                delete data[i].name
            } else{
                this.servicesList[data[i].name] = data[i];
            }
        }
    };

    saveAllServicesList(){
        let list = [];
        for (let service of Object.keys(this.servicesTrees)){
            list.push({
                name: this.servicesTrees[service].name,
                id: this.servicesTrees[service].id
            })
        }

        for (let service of Object.keys(this.servicesList)){
            if (service !== "---------------") {
                list.push({
                    name: this.servicesList[service].name,
                    id: this.servicesList[service].id
                })
            }
        }
        this.allServices = list;
    }

    getSavedServicesAsList(){
        return Object.keys(this.servicesTrees)
    }
    getServicesAsList(){
        return Object.keys(this.servicesList)
    }
}

export let dataFactory = new DataFactory();