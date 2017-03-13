import {calcBuild} from "./ecs-calc-build";
import {calcOption} from "./ecs-calc-option";
import {CalcLogic} from "./ecs-calc-logic";
import {dataFactory} from "../dataFactory/dataFactory";
import { generalOptions } from '../generalOtions/generalOptions';

class CalcEventListener {
	constructor(CalcLogicClass) {

		this.calcLogic = CalcLogicClass;

       

	}
	inputLengthFilter(string){

        let filteredString = (string.length > 20) ? string.slice(0, 15)+"..." : string;
        
		return filteredString
	}
    addDeadlineListeners(){
        this.deadlineOptions = document.querySelectorAll(".ecs__select-option--deadline");
        for(let option of this.deadlineOptions){
            option.addEventListener('click', this.deadlineOptionClick.bind(this));
        }
    }
	addLevelListeners(){
        this.levelOptions = document.querySelectorAll(".ecs__select-option--level");
        for(let option of this.levelOptions){
            option.addEventListener('click', this.levelOptionClick.bind(this));
        }
    }
	addEventListeners(){

        this.serviceSelected	= document.querySelector(".ecs__service__current");
        this.levelSelected 		= document.querySelector(".ecs__level__current");
        this.deadlineSelected 	= document.querySelector(".ecs__deadline__current");


        
        this.serviceList	= document.querySelector(".ecs__list__wrapper--service");
        this.levelList 		= document.querySelector(".ecs__list__wrapper--level");
        this.deadlineList 	= document.querySelector(".ecs__list__wrapper--deadline");
        
        [ this.serviceList, this.levelList, this.deadlineList ].forEach(list => list.style.display = 'none');


        
        this.pageInput 		= document.querySelector(".ecs__page-input");



        
        this.inquiryBtn = document.querySelector(".ecs__btn--inquiry");
        this.orderBtn = document.querySelector(".ecs__btn--order");
        this.levelOptions = document.querySelectorAll(".ecs__select-option--level");
        this.serviceOptions = document.querySelectorAll(".ecs__select-option--service");

        this.deadlineOptions = document.querySelectorAll(".ecs__select-option--deadline");
        
        this.serviceList.addEventListener('mouseenter', this.listEnter);
        this.levelList.addEventListener('mouseenter', this.listEnter);
        this.deadlineList.addEventListener('mouseenter', this.listEnter);
        this.serviceList.addEventListener('mouseleave', this.listLeave);
        this.levelList.addEventListener('mouseleave', this.listLeave);
        this.deadlineList.addEventListener('mouseleave', this.listLeave);
		
		this.serviceSelected.addEventListener('click', this.selectedClick.bind(this, "service"));
        this.levelSelected.addEventListener('click', this.selectedClick.bind(this, "level"));
        this.deadlineSelected.addEventListener('click', this.selectedClick.bind(this, "deadline"));
		
		for(let option of this.serviceOptions){option.addEventListener('click', this.serviceOptionClick.bind(this));}
        for(let option of this.levelOptions){option.addEventListener('click', this.levelOptionClick.bind(this));}
        for(let option of this.deadlineOptions){option.addEventListener('click', this.deadlineOptionClick.bind(this));}

        this.pageInput.addEventListener("input", this.changeCountPages.bind(this));
        this.orderBtn.addEventListener("click", this.redirectToMy.bind(this, 'order'));
        this.inquiryBtn.addEventListener("click", this.redirectToMy.bind(this, 'inquiry'));
        document.querySelector("input.ecs__sort-list").addEventListener("input", this.sortList.bind(this));

	}
	

	selectedClick(listType, e) {
        switch (listType) {
            case('service'):
                this.serviceList.style.display = (this.serviceList.style.display === "none") ? "block" : "none";
                this.levelList.style.display = "none";
                this.deadlineList.style.display = "none";
                break;

            case('level'):
                this.levelList.style.display = (this.levelList.style.display === "none") ? "block" : "none";
                this.serviceList.style.display = 'none';
                this.deadlineList.style.display = 'none';
                break;

            case('deadline'):
                this.deadlineList.style.display = (this.deadlineList.style.display === "none") ? "block" : "none";
                this.serviceList.style.display = 'none';
                this.levelList.style.display = "none";
                break;

            default:
                break;
        }
    }
    
    serviceOptionClick(e){
		let service = e.target.dataset.value;
		this.serviceSelected.innerHTML = this.inputLengthFilter(service);
        this.serviceList.style.display = "none";



        if (!!dataFactory.servicesTrees[service]) {
        	calcOption.refreshMemoryStates(dataFactory.servicesTrees[service]);

            calcBuild.renderListOfLevels();
            this.calcLogic.checkCountPage();
            this.calcLogic.displayPrice();

            this.addLevelListeners();
        } else {
            calcEventListener.addNewServiceTree(dataFactory.servicesList[service].id);
        }


	}
    levelOptionClick(e){
        let level_name = e.target.dataset.level.toString();
        this.levelSelected.innerHTML = this.inputLengthFilter(e.target.innerHTML.toString());
        this.levelList.style.display =  "none";
		calcOption.memoryStates.level = level_name;

		this.calcLogic.checkCountPage();
		this.calcLogic.displayPrice();
		let deadlines = Object.keys(dataFactory.servicesTrees[calcOption.memoryStates.service]
            .level[calcOption.memoryStates.level].deadline);
		let lastDeadline = deadlines[deadlines.length - 1];
        let deadlineTree = dataFactory.servicesTrees[calcOption.memoryStates.service]
            .level[calcOption.memoryStates.level].deadline[lastDeadline];
        calcOption.refreshDeadlineStates(deadlineTree);
	

	}
    deadlineOptionClick(e){
        let deadline_name = e.target.innerHTML.toString();
        this.deadlineSelected.innerHTML = deadline_name;
        this.deadlineList.style.display = "none";
        let deadlineTree = dataFactory.servicesTrees[calcOption.memoryStates.service]
            .level[calcOption.memoryStates.level].deadline[deadline_name];
        calcOption.refreshDeadlineStates(deadlineTree);



        this.calcLogic.checkCountPage();
        this.calcLogic.displayPrice();

    }

    

	changeCountPages(element) {
		let $inputNubmer = element.target;
		let getCountPages = $inputNubmer.valueAsNumber;

		if (getCountPages > calcOption.memoryStates.maxPages) {
			setValue(calcOption.memoryStates.maxPages || 30, true);
			this.calcLogic.displayPrice();

		} else if (isNaN(getCountPages)) {
			setValue(1, true);

		} else if (getCountPages <= 0) {
			setValue(1, true);
			this.calcLogic.displayPrice();

		} else {
			setValue(getCountPages, true);
			this.calcLogic.displayPrice();
			this.calcLogic.checkCountPage();

		}
        this.calcLogic.checkCountPage();

		function setValue(countPages, displayValue) {
			calcOption.memoryStates.countPages = countPages.toFixed();
			$inputNubmer.setAttribute("value", calcOption.memoryStates.countPages);
			$inputNubmer.setAttribute("max", calcOption.memoryStates.maxPages);
			if (displayValue) {
				$inputNubmer.value = calcOption.memoryStates.countPages;
			}
		}
	}

	redirectToMy(type, e) {
        e.preventDefault();
		let serviceId =  dataFactory.servicesTrees[calcOption.memoryStates.service].id;
		let levelId = dataFactory.servicesTrees[calcOption.memoryStates.service].level[calcOption.memoryStates.level].id;
		let deadlineId = dataFactory.servicesTrees[calcOption.memoryStates.service].level[calcOption.memoryStates.level].deadline[calcOption.memoryStates.deadline].id;
		let countPages = calcOption.memoryStates.countPages;
        let redirectTo = calcOption.defaultsOptions.siteMyUrl + `/${type}.html?csi=` + serviceId + '&cli=' + levelId + '&cdi=' + deadlineId + '&ccu=' + countPages;
        if (generalOptions.apiMode !== 'M') {
            redirectTo += `&rid=${generalOptions.rid}`
        }
        location.href = redirectTo;
	}

	addNewServiceTree(...values) {
		let newServiceTree = {};
        dataFactory.getData(values).done(response => {
                dataFactory.sortedData(JSON.parse(response).info.services_tree, newServiceTree);
				Object.assign(dataFactory.servicesTrees, newServiceTree);
                calcOption.refreshMemoryStates(newServiceTree[Object.keys(newServiceTree)[0]]);
                calcBuild.renderListOfLevels();
                this.calcLogic.checkCountPage();
                this.calcLogic.displayPrice();
                this.addLevelListeners();
			})
			.fail(error => console.error(error));
	}

	sortList() {
		let $input = document.querySelector("input.ecs__sort-list");
		let filter = $input.value.toUpperCase();
		let $wrapperListService = document.querySelector(".ecs__service__list");
		let listService = $wrapperListService.getElementsByTagName('li');

		for (let i = 0; i < listService.length; i++) {
			let serviceText = listService[i].innerHTML.toUpperCase();
			if (serviceText.indexOf(filter) > -1) {
				listService[i].style.display = "";
			} else listService[i].style.display = "none";
		}
	}
}


export let calcEventListener = new CalcEventListener(new CalcLogic());