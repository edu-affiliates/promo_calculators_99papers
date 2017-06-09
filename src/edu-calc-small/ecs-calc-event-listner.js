
import {dataFactory} from "../dataFactory/dataFactory";
import { generalOptions } from '../generalOtions/generalOptions';

export class CalcEventListener {
	constructor(CalcLogicClass, calcBuild, calcOption, calcID) {
	    this.calcOption = calcOption;
	    this.calcBuild = calcBuild;
		this.calcLogic = CalcLogicClass;
		this.calcID = calcID;
	}

	inputLengthFilter(string){

        let filteredString = (string.length > 20) ? string.slice(0, 15)+"..." : string;
		return filteredString
	}

    addDeadlineListeners(){
        this.deadlineOptions = document.querySelectorAll(`#${this.calcID} .ecs__select-option--deadline`);
        for(let option of this.deadlineOptions){
            option.addEventListener('click', this.deadlineOptionClick.bind(this));
        }
    }

	addLevelListeners(){
        this.levelOptions = document.querySelectorAll(`#${this.calcID} .ecs__select-option--level`);
        for(let option of this.levelOptions){
            option.addEventListener('click', this.levelOptionClick.bind(this));
        }
    }
	addEventListeners(){

        document.body.addEventListener('click', (e) => {
            this.isClickOnList(e.target);
        });
        this.serviceSelected	= document.querySelector(`#${this.calcID} .ecs__service__current`);
        this.levelSelected 		= document.querySelector(`#${this.calcID} .ecs__level__current`);
        this.deadlineSelected 	= document.querySelector(`#${this.calcID} .ecs__deadline__current`);

        
        this.serviceList	= document.querySelector(`#${this.calcID} .ecs__list__wrapper--service`);
        this.levelList 		= document.querySelector(`#${this.calcID} .ecs__list__wrapper--level`);
        this.deadlineList 	= document.querySelector(`#${this.calcID} .ecs__list__wrapper--deadline`);

        this.pageInput 		= document.querySelector(`#${this.calcID} .ecs__page-input`);

        this.inquiryBtn = document.querySelector(`#${this.calcID} .ecs__btn--inquiry`);
        this.orderBtn = document.querySelector(`#${this.calcID} .ecs__btn--order`);
        this.levelOptions = document.querySelectorAll(`#${this.calcID} .ecs__select-option--level`);
        this.serviceOptions = document.querySelectorAll(`#${this.calcID} .ecs__select-option--service`);

        this.deadlineOptions = document.querySelectorAll(`#${this.calcID} .ecs__select-option--deadline`);

		this.serviceSelected.addEventListener('click', this.selectedClick.bind(this, "service"));
        this.levelSelected.addEventListener('click', this.selectedClick.bind(this, "level"));
        this.deadlineSelected.addEventListener('click', this.selectedClick.bind(this, "deadline"));
		
		for(let option of this.serviceOptions){option.addEventListener('click', this.serviceOptionClick.bind(this));}
        for(let option of this.levelOptions){option.addEventListener('click', this.levelOptionClick.bind(this));}
        for(let option of this.deadlineOptions){option.addEventListener('click', this.deadlineOptionClick.bind(this));}

        this.pageInput.addEventListener("input", this.changeCountPages.bind(this));
        this.orderBtn.addEventListener("click", this.redirectToMy.bind(this, 'order'));
        this.inquiryBtn.addEventListener("click", this.redirectToMy.bind(this, 'inquiry'));
        document.querySelector(`#${this.calcID} input.ecs__sort-list`).addEventListener("input", this.sortList.bind(this));

	}
	

	selectedClick(listType, e) {
        this.calcLogic.setListsTopPositions();

        switch (listType) {
            case('service'):
                this.serviceList.classList.toggle('ecs__list__wrapper--open');
                this.levelList.classList.remove('ecs__list__wrapper--open');
                this.deadlineList.classList.remove('ecs__list__wrapper--open');
                break;

            case('level'):
                this.levelList.classList.toggle('ecs__list__wrapper--open');
                this.serviceList.classList.remove('ecs__list__wrapper--open');
                this.deadlineList.classList.remove('ecs__list__wrapper--open');
                break;

            case('deadline'):
                this.deadlineList.classList.toggle('ecs__list__wrapper--open');
                this.levelList.classList.remove('ecs__list__wrapper--open');
                this.serviceList.classList.remove('ecs__list__wrapper--open');
                break;

            default:
                break;
        }
    }
    
    serviceOptionClick(e){
		let service = e.target.dataset.value;
		this.serviceSelected.innerHTML = this.inputLengthFilter(service);
        this.serviceList.classList.toggle('ecs__list__wrapper--open');

        if (!!dataFactory.servicesTrees[service]) {
        	this.calcOption.refreshMemoryStates(dataFactory.servicesTrees[service].name);

            this.calcBuild.renderListOfLevels();
            this.calcLogic.checkCountPage();
            this.calcLogic.displayPrice();

            this.addLevelListeners();
        } else {
            this.addNewServiceTree(dataFactory.servicesList[service].id);
        }
	}

    levelOptionClick(e){
        let level_name = e.target.dataset.level.toString();
        this.levelSelected.innerHTML = this.inputLengthFilter(e.target.innerHTML.toString());
        this.levelList.classList.remove('ecs__list__wrapper--open');
		this.calcOption.memoryStates.level = level_name;
        this.calcOption.refreshDeadlineStates(this.calcOption.memoryStates.deadline);
		this.calcLogic.checkCountPage();
		this.calcLogic.displayPrice();
	}

    deadlineOptionClick(e){
        let deadline_name = e.target.innerHTML.toString();
        this.deadlineSelected.innerHTML = deadline_name;
        this.deadlineList.classList.remove('ecs__list__wrapper--open');
        this.calcOption.refreshDeadlineStates(deadline_name);
        this.calcLogic.checkCountPage();
        this.calcLogic.displayPrice();
    }

    isClickOnList(element){

        let elementClasses = element.classList.toString();
        let onList = elementClasses.indexOf('ecs__list__wrapper') > -1 || elementClasses.indexOf('ecs__list') > -1;
        let onBody = element.tagName === 'BODY';

        if (!onList && !onBody) {
            this.isClickOnList(element.parentNode)
        } else if (onBody){
            this.deadlineList.classList.remove('ecs__list__wrapper--open');
            this.levelList.classList.remove('ecs__list__wrapper--open');
            this.serviceList.classList.remove('ecs__list__wrapper--open');
        }
    }

	changeCountPages(element) {

		let $inputNubmer = element.target;
		let getCountPages = $inputNubmer.valueAsNumber;
        let setValue = (countPages, displayValue) => {
            this.calcOption.memoryStates.countPages = countPages.toFixed();
            $inputNubmer.setAttribute("value", this.calcOption.memoryStates.countPages);
            $inputNubmer.setAttribute("max", this.calcOption.memoryStates.maxPages);
            if (displayValue) {
                $inputNubmer.value = this.calcOption.memoryStates.countPages;
            }
        };

		if (getCountPages > this.calcOption.memoryStates.maxPages) {
			setValue(this.calcOption.memoryStates.maxPages || 30, true);
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


	}

	redirectToMy(type, e) {
        e.preventDefault();
		let serviceId =  dataFactory
            .servicesTrees[this.calcOption.memoryStates.service]
            .id;
		let levelId = dataFactory
            .servicesTrees[this.calcOption.memoryStates.service]
            .level[this.calcOption.memoryStates.level]
            .id;
		let deadlineId = dataFactory
            .servicesTrees[this.calcOption.memoryStates.service]
            .level[this.calcOption.memoryStates.level]
            .deadline[this.calcOption.memoryStates.deadline]
            .id;
		let countPages = this.calcOption.memoryStates.countPages;
        let redirectTo = generalOptions.siteMyUrl + `/${type}.html?csi=` + serviceId + '&cli=' + levelId + '&cdi=' + deadlineId + '&ccu=' + countPages;
        if (generalOptions.apiMode !== 'M') {
            redirectTo += `&rid=${generalOptions.rid}`
        }
        location.href = redirectTo;
	}

	addNewServiceTree(values) {

		let newServiceTree = {};
        dataFactory.getData(values).then(response => {
            dataFactory.sortedData(JSON.parse(response).info.services_tree, newServiceTree);
            Object.assign(dataFactory.servicesTrees, newServiceTree);
            this.calcOption.refreshMemoryStates(Object.keys(newServiceTree)[0]);
            this.calcBuild.renderListOfLevels();
            this.calcLogic.checkCountPage();
            this.calcLogic.displayPrice();
            this.addLevelListeners();

        }).catch(err => console.log(err));

	}

	sortList() {
		let $input = document.querySelector(`#${this.calcID} input.ecs__sort-list`);
		let filter = $input.value.toUpperCase();
		let $wrapperListService = document.querySelector(`#${this.calcID} .ecs__service__list`);
		let listService = $wrapperListService.getElementsByTagName('li');

		for (let i = 0; i < listService.length; i++) {
			let serviceText = listService[i].innerHTML.toUpperCase();
			if (serviceText.indexOf(filter) > -1) {
				listService[i].style.display = "";
			} else listService[i].style.display = "none";
		}
	}
}


