
import {dataFactory} from "../dataFactory/dataFactory";
import { generalOptions } from '../generalOtions/generalOptions';
import { helper } from '../helper/helper'

export class FastOrder{
    constructor(elementID){
        this.dataFactory = dataFactory;
        this.helper = helper;
        this.wrapper = document.getElementById(elementID);


        this.buildDomCalc();

        console.log(document.querySelector(`#${elementID} .edu-fast__services`));
        this.servicesList = this.wrapper.querySelectorAll(`.edu-fast__services`)[0];
        this.servicesListWrapper = this.wrapper.querySelectorAll(`.edu-fast__list-wrapper`)[0];
        console.log(this.servicesList);
        this.currentService = this.wrapper.querySelectorAll(`.edu-fast__current`)[0];
        this.orderBtn = this.wrapper.querySelectorAll(`.edu-fast__order-btn`)[0];
        this.input = this.wrapper.querySelectorAll(`.edu-fast__sort-list`)[0];

        this.buildServicesList();
        const FIRST_SERVICE = dataFactory.allServices.find(service => service.name === "Essay");
        this.chooseService(FIRST_SERVICE.id, FIRST_SERVICE.name);
        this.servicesListWrapper.style.display = 'none';
        this.addEventListeners();
    }
    buildDomCalc() {
        let fastOrderFormTemplate = `
            <div class="edu-fast__form-wrapper">
                <span class="edu-fast__title">I need</span>
                <span class="edu-fast__current">Essay</span>
                <span class="edu-fast__order-btn">Order Now</span>
            </div>
            <div class="edu-fast__list-wrapper">
                <input class="edu-fast__sort-list" placeholder="Type the Name of Service" type="text">
                <ul class="edu-fast__services"></ul>
            </div>
        `;

        this.wrapper.insertAdjacentHTML("afterbegin", fastOrderFormTemplate);
    };

    buildServicesList(){
        for (let service of this.dataFactory.allServices){
            let $selectOption = document.createElement('li');
            $selectOption.classList.add("edu-fast__option");
            $selectOption.setAttribute("data-id", service.id);
            $selectOption.setAttribute("data-name", service.name);
            $selectOption.innerHTML = service.name;
            this.servicesList.appendChild($selectOption);
        }
    }
    chooseService(service_id, service_name){
        this.currentService.setAttribute("data-id", service_id);
        this.currentService.setAttribute("data-name", service_name);
        this.currentService.innerHTML = this.helper.inputLengthFilter(service_name, 22, 18);
    }

    addEventListeners(){
        this.currentService.addEventListener('click', currentClick.bind(this));
        this.orderBtn.addEventListener('click', orderClick.bind(this));
        let services = this.servicesList.querySelectorAll('.edu-fast__option');
        this.input.addEventListener('input', this.helper.sortList.bind(this, this.input, services));
        for (let service of services){
            service.addEventListener('click', serviceClick.bind(this))
        }
        function serviceClick(e){
            let service = e.target.dataset;
            this.chooseService(service.id, service.name);
            this.servicesListWrapper.style.display = "none";
        }
        function currentClick(){
            this.servicesListWrapper.style.display = (this.servicesListWrapper.style.display === "none") ? "block" : "none";
        }
        function orderClick(){
            let redirectTo = `${generalOptions.siteMyUrl}/order.html?csi=${this.currentService.dataset.id}`;
            if (generalOptions.apiMode !== 'M') {
                redirectTo += `&rid=${generalOptions.rid}`
            }
            location.href = redirectTo;
        }
    }


}

