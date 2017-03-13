import {calcEventListener} from "./ecs-calc-event-listner";
import {CalcLogic} from "./ecs-calc-logic";
import {calcOption} from "./ecs-calc-option";
import {dataFactory} from "../dataFactory/dataFactory";

class CalcBuild {
    constructor(CalcLogicClass) {
        this.calcLogic = CalcLogicClass;

    }

    buildDomCalc() {
    	let refElem = document.querySelector('.ecs');

    	let calcTemplate = `<!--TITLE-->
                    <div class="ecs__title">Get a quick estimate</div>

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
                        <span class="ecs__price__title">Estimate price:</span><span class="ecs__price__value">$42.20</span>
                    </div>

                    <!--BUTTON-->
                    <div class="ecs__btns">
                        <div class="ecs__btn ecs__btn--inquiry">Inquiry</div>
                        <div class="ecs__btn ecs__btn--order">Order</div>
                    </div>`;

    	refElem.insertAdjacentHTML("afterbegin", calcTemplate);

    };

    build() {

        this.renderListOfServices();
        this.renderListOfLevels();

        this.renderListOfDeadlines();
        this.calcLogic.setCountPages();

        calcEventListener.addEventListeners();
    }


    renderListOfServices() {
        //todo condition
        let $serviceList = document.querySelector(".ecs__service__list");
        let $serviceCurrent = document.querySelector(".ecs__service__current");

        let service_name = calcOption.memoryStates.service;


        Object.keys(dataFactory.servicesTrees).forEach(service => {

            let $selectOption = document.createElement('li');
            $selectOption.classList.add("ecs__select-option--service");
            $selectOption.classList.add("ecs__select-option");
            $selectOption.setAttribute("data-id", dataFactory.servicesTrees[service].id);
            $selectOption.setAttribute("data-value", dataFactory.servicesTrees[service].name);
            $selectOption.innerHTML = dataFactory.servicesTrees[service].name;
            $serviceList.appendChild($selectOption);
        });
        Object.keys(dataFactory.servicesList).forEach(service => {
            let $selectOption = document.createElement('li');
            $selectOption.classList.add("ecs__select-option--service");
            $selectOption.classList.add("ecs__select-option");
            $selectOption.setAttribute("data-id", dataFactory.servicesList[service].id);
            $selectOption.setAttribute("data-value", dataFactory.servicesList[service].name);
            $selectOption.innerHTML = dataFactory.servicesList[service].name;
            $serviceList.appendChild($selectOption);
        });


        $serviceCurrent.innerHTML = calcEventListener.inputLengthFilter(service_name);

        this.renderListOfLevels();
    }

    renderListOfLevels() {

        let service_name = calcOption.memoryStates.service;
        let level_name = calcOption.memoryStates.level;
        let $levelList = document.querySelector(".ecs__level__list");

        let $levelCurrent = document.querySelector(".ecs__level__current");

        $levelList.innerHTML = '';
        renderLevels(service_name);


        function renderLevels(service_name) {
            Object.keys(dataFactory.servicesTrees[service_name].level).forEach(level => {
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
            });

            $levelCurrent.innerHTML = calcEventListener.inputLengthFilter(level_name);

        }

    }

    renderListOfDeadlines() {

        let service_name = calcOption.memoryStates.service;
        let level_name = calcOption.memoryStates.level;
        let $deadlineList = document.querySelector(".ecs__deadline__list");
        let $deadlineCurrent = document.querySelector(".ecs__deadline__current");

        let deadline_name = calcOption.memoryStates.deadline;

        $deadlineList.innerHTML = '';
        Object.keys(dataFactory.servicesTrees[service_name].level[level_name].deadline).forEach(deadline => {

            let $selectOption = document.createElement('li');
            $selectOption.classList.add("ecs__select-option");
            $selectOption.classList.add("ecs__select-option--deadline");
            $selectOption.innerHTML = deadline;
            $deadlineList.appendChild($selectOption);

        });
        $deadlineCurrent.innerHTML = deadline_name;


    }

}



export let calcBuild = new CalcBuild(new CalcLogic());
