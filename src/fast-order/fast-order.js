
import {dataFactory} from "../dataFactory/dataFactory";
import { generalOptions } from '../generalOtions/generalOptions';
import { helper } from '../helper/helper'

export class FastOrder{
    constructor(elementID, options){
        this.options = options;
        this.dataFactory = dataFactory;
        this.helper = helper;
        this.wrapper = document.getElementById(elementID);
        this.dsc = this.options.dsc;
        this.btn = {
            name: 'order',
            type: 'order'
        };
        this.btn.type = (this.options.btnType !== undefined) ? this.options.btnType : 'order';
        this.btn.name = (this.options.btnName !== undefined) ? this.options.btnName : 'order';
        this.buildDomCalc();


        this.servicesList = this.wrapper.querySelectorAll(`.edu-fast__services`)[0];
        this.servicesListWrapper = this.wrapper.querySelectorAll(`.edu-fast__list-wrapper`)[0];
        this.currentService = this.wrapper.querySelectorAll(`.edu-fast__current`)[0];
        this.orderBtn = this.wrapper.querySelectorAll(`.edu-fast__order-btn`)[0];
        this.input = this.wrapper.querySelectorAll(`.edu-fast__sort-list`)[0];

        this.buildServicesList();
        const FIRST_SERVICE = dataFactory.allServices.find(service => service.name === "Essay");
        this.chooseService(FIRST_SERVICE.id, FIRST_SERVICE.name);

        this.closedListStyle = `
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;`;
        this.openedListStyle = `
            opacity: 1;
            visibility: visible;
            transition-delay: 0s, 0s, 0.3s;`;

        this.servicesListWrapper.setAttribute('Style', this.closedListStyle);
        this.addEventListeners();
    }
    buildDomCalc() {
        let fastOrderFormTemplate = `
            <div class="edu-fast__form-wrapper">
                <span class="edu-fast__title">I need</span>
                <span class="edu-fast__current">Essay</span>
            </div>
            <div class="edu-fast__list-wrapper">
                <input class="edu-fast__sort-list" placeholder="Type the Name of Service" type="text">
                <ul class="edu-fast__services"></ul>
            </div>
            <span class="edu-fast__order-btn">${this.btn.name}</span>
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
    isClickOnList(element){

        let elementClasses = element.classList.toString();
        let onList = elementClasses.indexOf('edu-fast__current') > -1 || elementClasses.indexOf('edu-fast__list-wrapper') > -1;
        let onBody = element.tagName === 'BODY';

        if (!onList && !onBody) {
            this.isClickOnList(element.parentNode)
        } else if (onBody){
            this.servicesListWrapper.setAttribute('Style', this.closedListStyle);
        }
    }

    addEventListeners(){
        document.body.addEventListener('click', (e) => {
            this.isClickOnList(e.target);
        });
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
            this.servicesListWrapper.setAttribute('Style', this.closedListStyle);
        }
        function currentClick(){

            let listClosed = this.servicesListWrapper.style.visibility === 'hidden';
            if (!listClosed) {
                this.servicesListWrapper.setAttribute('Style', this.closedListStyle);
            } else {
                this.servicesListWrapper.setAttribute('Style', this.openedListStyle);
            }
        }
        function orderClick(){
            let redirectTo = `${generalOptions.siteMyUrl}/${this.btn.type}.html?csi=${this.currentService.dataset.id}`;
            if (generalOptions.apiMode !== 'M') {
                redirectTo += `&rid=${generalOptions.rid}`
            }
            location.href = redirectTo;
        }
    }


}

