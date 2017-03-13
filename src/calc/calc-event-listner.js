import {calcBuild} from "./calc-build";
import {calcOption} from "./calc-option";
import {CalcLogic} from "./calc-logic";
import {dataFactory} from "../dataFactory/dataFactory";
import { generalOptions } from '../generalOtions/generalOptions';

class CalcEventListener {
	constructor(CalcLogicClass) {
		this.calcLogic = CalcLogicClass;
	}

	eventsListner() {
		document.getElementById("services__button").addEventListener('click', this.serviceButtonCallbackClick.bind(this));
		document.getElementById("level__button").addEventListener('click', this.levelButtonCallbackClick.bind(this));
		document.querySelector("div.calculator__type-select").addEventListener("click", this.selectButtonCallbackClick.bind(this));
		document.querySelector("input.calculator__number-target").addEventListener("input", this.changeCountPages.bind(this));
		document.querySelector("button.calculator__order-button").addEventListener("click", this.redirectToMy.bind(this, "order"));
		document.querySelector("button.calculator__inquiry-button").addEventListener("click", this.redirectToMy.bind(this, "inquiry"));
		document.querySelector("input.calculator__sort-list").addEventListener("input", this.sortList.bind(this));
		document.querySelector("p.calculator__custom-service-cross").addEventListener("click", this.closeCustomServiceBlockCallback.bind(this));

		this.rangeEventsListner();
	};

	rangeEventsListner() {
		document.getElementsByClassName("range-labels")[0].addEventListener('click', this.rangeLabelsCallbackClick.bind(this));
		document.getElementById("range").addEventListener('input', this.rangeCallbackDrug.bind(this));
	}


	serviceButtonCallbackClick(e) {
		if (!(e.target.id == 'services__button')) {
			let nameButton = e.target.getAttribute("data-name");
			this.calcLogic.displayCustomService("hide");

			if (nameButton == "Choose Other") {
				calcOption.memoryStates.service = "Choose Other";
				this.calcLogic.displayListsNameButton("show");
				this.calcLogic.colorButton(e);
			}

			if (!(calcOption.memoryStates.service == nameButton)) {
				this.calcLogic.displayListsNameButton("hide");
				calcOption.memoryStates.service = nameButton;

				this.calcLogic.colorButton(e);
				calcBuild.renderButton("level", nameButton);
				this.calcLogic.checkCountPage();
				this.calcLogic.getPricing(calcOption.memoryStates.service);
			}

			this.calcLogic.checkCountPage();
		}
	}

	levelButtonCallbackClick(e) {
		if (!(e.target.id == 'level__button')) {
			let nameButton = e.target.getAttribute("data-name");

			if (!(calcOption.memoryStates.service == nameButton)) {
				calcOption.memoryStates.level = nameButton;
				this.calcLogic.colorButton(e);
				calcBuild.renderRangeSlider(true);
				this.calcLogic.checkCountPage();
				this.calcLogic.getPricing(calcOption.memoryStates.service);
			}

			this.calcLogic.checkCountPage();
		}
	}

	selectButtonCallbackClick(e) {
		if (!(e.target.id === 'lists_service')) {
			let value = e.target.getAttribute("data-value");
			let selectedIndex = e.target.getAttribute("data-id");
			let nameOption = value;
			calcOption.memoryStates.service = nameOption;
			if (!(dataFactory.servicesTrees[nameOption])) {
				this.addNewServiceTree(selectedIndex);
			} else {
				calcBuild.renderButton("level", calcOption.memoryStates.service);
				this.calcLogic.checkCountPage();
				this.calcLogic.getPricing(calcOption.memoryStates.service);
			}

			this.calcLogic.displayListsNameButton("hide");
			this.calcLogic.displayCustomService("show", value);
			this.calcLogic.checkCountPage();
		}
	}

	rangeLabelsCallbackClick(e) {

		let childNodes = Array.prototype.slice.call(e.target.parentNode.childNodes);
		let index = Number(childNodes.indexOf(e.target));
		calcOption.rangerStates.index = index + 1;
		let rangeElement = document.getElementById("range");
		rangeElement.value = index + 1;
		let nameLevel;
		let nameDeadline;

		if (calcOption.memoryStates.service == "name" || calcOption.memoryStates.level == "name" || calcOption.memoryStates.service == "Choose Other") {
			nameLevel = Object.keys(dataFactory.servicesTrees[Object.keys(dataFactory.servicesTrees)[0]].level)[0];
			nameDeadline = (Object.keys(dataFactory.servicesTrees[Object.keys(dataFactory.servicesTrees)[0]].level[nameLevel].deadline).reverse())[index];
		} else {
			nameDeadline = (Object.keys(dataFactory.servicesTrees[calcOption.memoryStates.service].level[calcOption.memoryStates.level].deadline).reverse())[index];
		}

		if (!(calcOption.memoryStates.deadline == nameDeadline)) {
			calcOption.memoryStates.deadline = nameDeadline;
			this.calcLogic.movePopUp(index + 1);
			this.calcLogic.colorRange(childNodes, index + 1);
			this.calcLogic.getPricing(calcOption.memoryStates.deadline);
			this.calcLogic.checkCountPage();
		}
	}

	rangeCallbackDrug(e) {
		let index = Number(e.target.value);
		calcOption.rangerStates.index = index;
		let childNodes = Array.prototype.slice.call(document.querySelector("div.range-labels").childNodes);
		let nameDeadline;
		if (calcOption.memoryStates.service == "name" || calcOption.memoryStates.level == "name" || calcOption.memoryStates.service == "Choose Other") {
			let nameLevel = Object.keys(dataFactory.servicesTrees[Object.keys(dataFactory.servicesTrees)[0]].level)[0];
			nameDeadline = (Object.keys(dataFactory.servicesTrees[Object.keys(dataFactory.servicesTrees)[0]].level[nameLevel].deadline).reverse())[index - 1];
		} else {
			nameDeadline = (Object.keys(dataFactory.servicesTrees[calcOption.memoryStates.service].level[calcOption.memoryStates.level].deadline).reverse())[index - 1];
		}
		if (!(calcOption.memoryStates.deadline == nameDeadline)) {
			calcOption.memoryStates.deadline = nameDeadline;
			this.calcLogic.colorRange(childNodes, index);
			this.calcLogic.movePopUp(index);
			this.calcLogic.getPricing(calcOption.memoryStates.deadline);
			this.calcLogic.checkCountPage();
		}
	}

	closeCustomServiceBlockCallback(){
		this.calcLogic.displayCustomService("hide");
		this.calcLogic.displayListsNameButton("show");
	}

	changeCountPages(element) {
		let $inputNubmer = element.target;
		let getCountPages = $inputNubmer.valueAsNumber;

		if (getCountPages > calcOption.defaultsOptions.maxPages) {
			setValue(calcOption.defaultsOptions.maxPages || 30, true);
			this.calcLogic.displayPrice();
		} else if (isNaN(getCountPages)) {
			setValue(1, false);
		} else if (getCountPages <= 0) {
			setValue(1, true);
			this.calcLogic.displayPrice();
		} else {
			setValue(getCountPages, true);
			this.calcLogic.displayPrice();
		}

		function setValue(countPages, displayValue) {
			calcOption.defaultsOptions.countPages = countPages.toFixed();
			$inputNubmer.setAttribute("value", calcOption.defaultsOptions.countPages);
			$inputNubmer.setAttribute("max", calcOption.defaultsOptions.maxPages);
			if (displayValue) {
				$inputNubmer.value = calcOption.defaultsOptions.countPages;
			}
		}
	}

	redirectToMy(typeOrder, e) {
		e.preventDefault();
		let serviceId = calcOption.memoryStates.service == "name" ? 1 : dataFactory.servicesTrees[calcOption.memoryStates.service].id;
		let levelId = calcOption.memoryStates.service == "name" || calcOption.memoryStates.level == "name" ? 1 : dataFactory.servicesTrees[calcOption.memoryStates.service].level[calcOption.memoryStates.level].id;
		let deadlineId = calcOption.memoryStates.service == "name" || calcOption.memoryStates.level == "name" || calcOption.memoryStates.deadline == "name" ? 1 : dataFactory.servicesTrees[calcOption.memoryStates.service].level[calcOption.memoryStates.level].deadline[calcOption.memoryStates.deadline].id;
		let countPages = calcOption.defaultsOptions.countPages;
		let redirectTo;
		if (typeOrder == "inquiry") {
            redirectTo = calcOption.defaultsOptions.siteMyUrl + '/inquiry.html?csi=' + serviceId + '&cli=' + levelId + '&cdi=' + deadlineId + '&ccu=' + countPages;
		} else {
            redirectTo = calcOption.defaultsOptions.siteMyUrl + '/order.html?csi=' + serviceId + '&cli=' + levelId + '&cdi=' + deadlineId + '&ccu=' + countPages;
		}
        if (generalOptions.apiMode !== 'M') {
            redirectTo += `&rid=${generalOptions.rid}`
		}
		location.href = redirectTo;
	}

	addNewServiceTree(values) {
		let newServiceTree = {};
		dataFactory.getData(values).done(response => {

				dataFactory.sortedData(JSON.parse(response).info.services_tree, newServiceTree);
				Object.assign(dataFactory.servicesTrees, newServiceTree);
				let newService = newServiceTree[Object.keys(newServiceTree)[0]];
				let newLevel = newService.level[Object.keys(newService.level)[0]];
             	calcOption.memoryStates.service = newService.name;
             	calcOption.memoryStates.level = newLevel.name;

				calcBuild.renderButton("level", calcOption.memoryStates.service);
				this.calcLogic.checkCountPage();
				this.calcLogic.getPricing(calcOption.memoryStates.service);
			})
			.fail(error => console.error(error));
	}

	sortList() {
		let $input = document.querySelector("input.calculator__sort-list");
		let filter = $input.value.toUpperCase();
		let $wrapperListService = document.querySelector("div.calculator__type-select");
		let listService = $wrapperListService.getElementsByTagName('p');

		for (let i = 0; i < listService.length; i++) {
			let serviceText = listService[i].innerHTML.toUpperCase();
			if (serviceText.indexOf(filter) > -1) {
				listService[i].style.display = "";
			} else listService[i].style.display = "none";
		}
	}
}


export let calcEventListener = new CalcEventListener(new CalcLogic());