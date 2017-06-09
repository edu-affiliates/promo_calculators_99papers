import {CalcEventListener} from "./ecs-calc-event-listner";
import {CalcLogic} from "./ecs-calc-logic";
import {CalcOption} from "./ecs-calc-option";
import {dataFactory} from "../dataFactory/dataFactory";
import {helper} from "../helper/helper";


export class SmallCalculator {
    constructor(calcID, options) {

        this.calcID = calcID;
        this.options = options;
        this.orderBtnName = (options.orderBtn !== undefined) ? options.orderBtn : 'Order';
        this.inquiryBtnName = (options.inquiryBtn !== undefined) ? options.inquiryBtn : 'Inquiry';
        this.calcOption = new CalcOption(options, this, calcID);
        this.calcLogic = new CalcLogic( calcID, this.calcOption );
        this.calcEventListener = new CalcEventListener(this.calcLogic, this,  this.calcOption, calcID);

        this.build = () => {
            this.calcLogic.hideDiscount();
            this.renderListOfServices();
            this.renderListOfLevels();
            this.renderListOfDeadlines();
            this.calcLogic.setCountPages();
            this.calcEventListener.addEventListeners();
            this.calcOption.hideDefaultsOptions();
        };
        this.calcOption.setDefaultMemoryStates();
    }

    buildDomCalc() {

    	let refElem = document.querySelector(`#${this.calcID}`);

    	let calcTemplate = `<!--TITLE-->
                    
                    <!--SERVICES-->
                    <div class="ecs__service ecs__list">
                        <span class="ecs__service__current">Essay</span>
                    </div>
                    <div class="ecs__list__wrapper ecs__list__wrapper--service">
                        <input class="ecs__sort-list" placeholder="Type the Name of Service" type="text">
                        <ul class="ecs__list--dropdown ecs__service__list"></ul>
                    </div>
                        
                        
                    <!--LEVELS-->
                    <div class="ecs__level ecs__list">
                        <span class="ecs__level__current">High School</span>
                    </div>
                    <div class="ecs__list__wrapper ecs__list__wrapper--level">
                        <ul class="ecs__list--dropdown ecs__level__list"></ul>
                    </div>
                        
                        
                    <!-- DEADLINES-->
                    <div class="ecs__deadline ecs__list">   
                        <span class="ecs__deadline__current">6 Hours</span>
                    </div>
                    <div class="ecs__list__wrapper ecs__list__wrapper--deadline">
                        <ul class="ecs__list--dropdown ecs__deadline__list"></ul>
                    </div>
                        
                        
                    <!-- PAGE COUNT-->
                    <div class="ecs__page-count">
                        <div class="ecs__minus-btn">-</div>
                        <span>
                            <input type="number" min="1" max='30' class="ecs__page-input" value="1">
                            <span class="ecs__page--subtitle">page</span>
                        </span>
                        <div class="ecs__plus-btn">+</div>
                    </div>

                    <!--PRICE-->
                    <div class="ecs__price">
                        <span class="ecs__price__title">Estimate price:</span>
                        <span class="ecs__prices">
                            <span class="ecs__price__old">5</span>
                            <span class="ecs__price__value">$42.20</span>
                            <span class="ecs__price__old__line"></span>
                        </span>
                        
                    </div>

                    <!--BUTTON-->
                    <div class="ecs__btns">
                        <div class="ecs__btn ecs__btn--inquiry">${this.inquiryBtnName}</div>
                        <div class="ecs__btn ecs__btn--order">${this.orderBtnName}</div>
                    </div>`;

    	refElem.insertAdjacentHTML("beforeend", calcTemplate);

    };

    renderListOfServices() {
        let $serviceList = document.querySelector(`#${this.calcID} .ecs__service__list`);
        let $serviceCurrent = document.querySelector(`#${this.calcID} .ecs__service__current`);
        let service_name = this.calcOption.memoryStates.service;

        for (let service of Object.keys(dataFactory.servicesTrees)) {

            let $selectOption = document.createElement('li');
            $selectOption.classList.add("ecs__select-option--service");
            $selectOption.classList.add("ecs__select-option");
            $selectOption.setAttribute("data-id", dataFactory.servicesTrees[service].id);
            $selectOption.setAttribute("data-value", dataFactory.servicesTrees[service].name);
            $selectOption.innerHTML = dataFactory.servicesTrees[service].name;
            $serviceList.appendChild($selectOption);
        }

        for (let service of Object.keys(dataFactory.servicesList)) {
            let $selectOption = document.createElement('li');
            $selectOption.classList.add("ecs__select-option--service");
            $selectOption.classList.add("ecs__select-option");
            $selectOption.setAttribute("data-id", dataFactory.servicesList[service].id);
            $selectOption.setAttribute("data-value", dataFactory.servicesList[service].name);
            $selectOption.innerHTML = dataFactory.servicesList[service].name;
            $serviceList.appendChild($selectOption);
        }


        $serviceCurrent.innerHTML = helper.inputLengthFilter(service_name);

        this.renderListOfLevels();
    }

    renderListOfLevels() {
        let service_name = this.calcOption.memoryStates.service;
        let level_name = this.calcOption.memoryStates.level;
        let $levelList = document.querySelector(`#${this.calcID} .ecs__level__list`);
        let $levelCurrent = document.querySelector(`#${this.calcID} .ecs__level__current`);

        $levelList.innerHTML = '';
        renderLevels(service_name);


        function renderLevels(service_name) {
            for (let level of Object.keys(dataFactory.servicesTrees[service_name].level)){
                let $selectOption = document.createElement('li');
                $selectOption.classList.add("ecs__select-option");
                $selectOption.classList.add("ecs__select-option--level");
                $selectOption.dataset['level'] = level;

                if (level === 'Undergraduate (1st and 2nd year)') {
                    $selectOption.innerHTML = "Undergrad. (yrs 1-2)";
                }
                else if (level === 'Undergraduate (3rd and 4th year)') {
                    $selectOption.innerHTML = "Undergrad. (yrs 3-4)";
                }
                else {
                    $selectOption.innerHTML = level;
                }

                $levelList.appendChild($selectOption);
            }

            if (level_name === 'Undergraduate (1st and 2nd year)') {

                $levelCurrent.innerHTML = helper.inputLengthFilter("Undergrad. (yrs 1-2)");
            }
            else if (level_name === 'Undergraduate (3rd and 4th year)') {

                $levelCurrent.innerHTML = helper.inputLengthFilter("Undergrad. (yrs 3-4)");
            }
            else {
                $levelCurrent.innerHTML = helper.inputLengthFilter(level_name);
            }
        }
    }

    renderListOfDeadlines() {
        let service_name = this.calcOption.memoryStates.service;
        let level_name = this.calcOption.memoryStates.level;
        let $deadlineList = document.querySelector(`#${this.calcID} .ecs__deadline__list`);
        let $deadlineCurrent = document.querySelector(`#${this.calcID} .ecs__deadline__current`);
        let deadline_name = this.calcOption.memoryStates.deadline;

        $deadlineList.innerHTML = '';
        for (let deadline of Object.keys(dataFactory.servicesTrees[service_name].level[level_name].deadline)){
            let $selectOption = document.createElement('li');
            $selectOption.classList.add("ecs__select-option");
            $selectOption.classList.add("ecs__select-option--deadline");
            $selectOption.innerHTML = deadline;
            $deadlineList.appendChild($selectOption);
        }
        $deadlineCurrent.innerHTML = deadline_name;
    }

}




