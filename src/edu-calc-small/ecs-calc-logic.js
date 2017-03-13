import {calcOption} from "./ecs-calc-option";
import {dataFactory} from "../dataFactory/dataFactory";
export class CalcLogic {
	constructor() {
	}

	checkCountPage() {
		let $inputCountPages = document.querySelector(".ecs__page-input");
		let countPages = $inputCountPages.value;
        let $elementPagesSub = document.querySelector(".ecs__page--subtitle");

		if (countPages > calcOption.memoryStates.maxPages) {
			$inputCountPages.setAttribute("value", calcOption.memoryStates.maxPages.toString());
			$inputCountPages.setAttribute("max", calcOption.memoryStates.maxPages.toString());
			$inputCountPages.value = calcOption.memoryStates.maxPages;
			calcOption.memoryStates.countPages = calcOption.memoryStates.maxPages;

		} else {
            $inputCountPages.setAttribute("max", calcOption.memoryStates.maxPages.toString());
		}
        $elementPagesSub.innerHTML = (calcOption.memoryStates.countPages == 1) ? 'page' : 'pages';
	}


	getPrice(){
		calcOption.memoryStates.price = dataFactory.servicesTrees[calcOption.memoryStates.service]
			.level[calcOption.memoryStates.level]
			.deadline[calcOption.memoryStates.deadline]
			.price;

		let estimatePrice = calcOption.memoryStates.price * calcOption.memoryStates.countPages;
		return estimatePrice.toFixed(2);
	}
	displayPrice() {
		let $displayPrice = document.querySelector(".ecs__price__value");
		$displayPrice.innerHTML = this.getPrice();
	}

	setCountPages() {
		let $elementPlus = document.querySelector(".ecs__plus-btn");
        let $elementMinus = document.querySelector(".ecs__minus-btn");
		let $elementTarget = document.querySelector(".ecs__page-input");
		let $elementPagesSub = document.querySelector(".ecs__page--subtitle");
		$elementPlus.addEventListener("click", refreshTarget.bind(this, "plus"));
		$elementMinus.addEventListener("click", refreshTarget.bind(this, "minus"));

		this.checkCountPage();
		this.displayPrice();
		function refreshTarget(incOrDec) {

			if (incOrDec == "plus" && calcOption.memoryStates.countPages < (calcOption.memoryStates.maxPages || 30)) {
				calcOption.memoryStates.countPages = +calcOption.memoryStates.countPages + 1;
				// $elementTarget.setAttribute("value", calcOption.memoryStates.countPages.toString());
                $elementPagesSub.innerHTML = (calcOption.memoryStates.countPages == 1) ? 'page' : 'pages';
				$elementTarget.value = calcOption.memoryStates.countPages;
			} else if (incOrDec == "minus" && calcOption.memoryStates.countPages > (calcOption.memoryStates.minPages || 1)) {
				calcOption.memoryStates.countPages -= 1;
				// $elementTarget.setAttribute("value", calcOption.memoryStates.countPages);
                $elementPagesSub.innerHTML = (calcOption.memoryStates.countPages == 1) ? 'page' : 'pages';
				$elementTarget.value = calcOption.memoryStates.countPages;
			}
            this.checkCountPage();
			this.displayPrice();
		}
	}



}