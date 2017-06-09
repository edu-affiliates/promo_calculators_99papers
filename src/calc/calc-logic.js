import {calcOption} from "./calc-option";
import { dataFactory } from "../dataFactory/dataFactory";

export class CalcLogic {
	constructor() {

	}

	displayListsNameButton(show) {
		let $select = document.querySelector("div.calculator__wrapper-services-list");
		if (show == "show") {
			$select.style['max-height'] = "400px";
		} else if (show == "hide") {
			$select.style['max-height'] = "0";
		}
	}

	displayCustomService(show, text) {
		showBlock(show);
		addText(text);
		this.displayListsNameButton("hide");

		function showBlock(show) {
			let $select = document.querySelector("div.calculator__custom-service");
			if (show == "show") {
				$select.style['display'] = "block";
			} else if (show == "hide") {
				$select.style['display'] = "none";
			}
		}

		function addText(text) {
			let $customServiceName = document.querySelector("p.calculator__custom-service-name");
			$customServiceName.innerHTML = text;
		}
	}

	checkCountPage() {
		let $inputCountPages = document.querySelector("input.calculator__number-target");
		let countPages = $inputCountPages.value;
		if (countPages > calcOption.defaultsOptions.maxPages) {
			$inputCountPages.setAttribute("value", calcOption.defaultsOptions.maxPages);
			$inputCountPages.setAttribute("max", calcOption.defaultsOptions.maxPages);
			$inputCountPages.value = calcOption.defaultsOptions.maxPages;
			calcOption.defaultsOptions.countPages = calcOption.defaultsOptions.maxPages;
		}
	}

	movePopUp(index) {
		let $rangePopUp = document.querySelector("span.range-popup");

		$rangePopUp.textContent = calcOption.memoryStates.deadline;

		let $renderRangePopUpTriangle = document.createElement("span");
		$rangePopUp.appendChild($renderRangePopUpTriangle);

		$rangePopUp.style.marginLeft = (index - 1) * 11 + '%';

		if(index > 1){
			$rangePopUp.style.left = - $rangePopUp.offsetWidth / 2 + "px";
			$renderRangePopUpTriangle.className = "range-popup__triangle-center";
		}
		if(index <= 1){
			$rangePopUp.style.left = `0px`;
			$renderRangePopUpTriangle.className = "range-popup__triangle-left";
		}
		if(index > 9){
			$rangePopUp.style.left = - $rangePopUp.offsetWidth + "px";
			$renderRangePopUpTriangle.className = "range-popup__triangle-right";
		}
	}

	colorButton(element) {
		let lengthArrayWithButtons = element.target.parentElement.children.length;
		for (let i = 0; i < lengthArrayWithButtons; i++) {
			element.target.parentElement.children[i].classList.remove("button__on-colors");
		}
		element.target.classList.add("button__on-colors");
	}

	colorRange(childNodes, index) {
		let track = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];
		let thumb = ['webkit-slider-thumb', 'moz-range-thumb', 'ms-thumb'];
		let style = '';
		let $mySheet = '' || calcOption.options.mySheet;

		createMySheet();

		if (!calcOption.options.mySheet) {
			findMySheet();
		}

		let valGradient = (index - 1) * (100 / (childNodes.length - 1));
		let marginThumb = -15 + (+index - 1) * 3;

		for (let i = 0; i < track.length; i++) {
			style += `.range input::-${track[i]}{background: linear-gradient(to right, ${calcOption.defaultsOptions.rangeColorChecked} 
					  0%, ${calcOption.defaultsOptions.rangeColorChecked} ${valGradient}%, ${calcOption.defaultsOptions.rangeColor} ${valGradient}%, ${calcOption.defaultsOptions.rangeColor} 100%)}
					  .range input::-${thumb[i]}{margin: -13px 0px 0px ${marginThumb}px;}`;
		}

		$mySheet.textContent = style;

		for (let i = 0; i < childNodes.length; i++) {
			childNodes[i].classList.remove("selected");
		}

		for (let i = index - 1; i >= 0; i--) {
			childNodes[i].classList.add("selected");
		}

		function findMySheet() {
			let $allSheet = document.querySelectorAll("style");
			let $findSheet;

			for (var i = 0; i < $allSheet.length; i++) {
				if ($allSheet[i].getAttribute("data-style") == "range-slider") {
					$findSheet = $allSheet[i];
				}
			}
			$mySheet = $findSheet;
			calcOption.options.mySheet = $findSheet;
		}

		function createMySheet() {
			if (!calcOption.options.styleSheets) {
				let $sheet = document.createElement('style');
				$sheet.setAttribute("data-style", "range-slider");
				document.body.appendChild($sheet);
				calcOption.options.styleSheets = true;
			}
		}
	}
	getPrice(){
		try{
            calcOption.defaultsOptions.price = dataFactory.servicesTrees[calcOption.memoryStates.service]
                .level[calcOption.memoryStates.level]
                .deadline[calcOption.memoryStates.deadline]
                .price;
            calcOption.defaultsOptions.maxPages = dataFactory.servicesTrees[calcOption.memoryStates.service].level[calcOption.memoryStates.level].deadline[calcOption.memoryStates.deadline].max_pages;
            calcOption.defaultsOptions.minPages = dataFactory.servicesTrees[calcOption.memoryStates.service].level[calcOption.memoryStates.level].deadline[calcOption.memoryStates.deadline].min_pages;

        } catch(e){}
       let estimatePrice = calcOption.defaultsOptions.price * calcOption.defaultsOptions.countPages;
		return estimatePrice.toFixed(2);
	}
    getPriceWithDiscount () {
        let coef = 1 - (calcOption.memoryStates.discount_amount / 100);
        let newPrice = this.getPrice() * coef;
        return newPrice.toFixed(2);
    }
	// getPricing() {
	// 	let getPrice = () => {
	//
	//
	// 	};
     //
    //
	// 	if (calcOption.memoryStates.service != "name" && calcOption.memoryStates.service != "Choose Other" && calcOption.memoryStates.level != "name" && calcOption.memoryStates.deadline != "name") {
	// 		// getPrice.call(this);
     //        this.displayPrice();
	// 	}
	// }

	displayPrice() {
		let $displayPrice = document.getElementById("s_f_count_page");
		// let $displayCountWords = document.getElementById("calc-word");
        let $discountPrice = document.querySelector(`#discount-price`);
		// $displayPrice.innerHTML = (calcOption.defaultsOptions.price * calcOption.defaultsOptions.countPages).toFixed(2);
		// $displayCountWords.innerHTML = (275 * calcOption.defaultsOptions.countPages);

        if (calcOption.memoryStates.discount_amount > 0){
            $discountPrice.innerHTML = this.getPrice();
            $displayPrice.innerHTML = this.getPriceWithDiscount();

        } else {
            $displayPrice.innerHTML = this.getPrice();
        }
	}

	setCountPages() {
		let $elementPlus = document.getElementById("button-plus");
		let $elementMinus = document.getElementById("button-minus");
		let $elementTarget = document.getElementById("button-target");

		$elementPlus.addEventListener("click", refreshTarget.bind(this, "plus"));
		$elementMinus.addEventListener("click", refreshTarget.bind(this, "minus"));

		function refreshTarget(incOrDec) {
			if (incOrDec == "plus" && calcOption.defaultsOptions.countPages < (calcOption.defaultsOptions.maxPages || 30)) {
				calcOption.defaultsOptions.countPages += 1;
				$elementTarget.setAttribute("value", calcOption.defaultsOptions.countPages);
				$elementTarget.value = calcOption.defaultsOptions.countPages;
			} else if (incOrDec == "minus" && calcOption.defaultsOptions.countPages > (calcOption.defaultsOptions.minPages || 1)) {
				calcOption.defaultsOptions.countPages -= 1;
				$elementTarget.setAttribute("value", calcOption.defaultsOptions.countPages);
				$elementTarget.value = calcOption.defaultsOptions.countPages;
			}
			this.displayPrice();
		}
	}
    hideDiscount(){
        let oldPrice = document.querySelector(`.calculator__cost-usd`);
        let calcTitleWithoutDsc = document.querySelector(`.edu-calc__title--hidden-dsc`);
        let calcTitleWithDsc= document.querySelector(`.edu-calc__title--shown-dsc`);
        oldPrice.style.display = 'none';
        if (calcTitleWithoutDsc) calcTitleWithoutDsc.style.display = 'block';
        if (calcTitleWithDsc) calcTitleWithDsc.style.display = 'none';

    }
    showDiscount(discount_amount){

        let oldPrice = document.querySelector(`.calculator__cost-usd`);
        let dscPercent = document.querySelector(`.edu-calc_title_dsc--percent`);
        let calcTitleWithoutDsc = document.querySelector(`.edu-calc__title--hidden-dsc`);
        let calcTitleWithDsc= document.querySelector(`.edu-calc__title--shown-dsc`);
        if (calcTitleWithoutDsc) calcTitleWithoutDsc.style.display = 'none';
        if (calcTitleWithDsc) calcTitleWithDsc.style.display = 'block';
        if (dscPercent) dscPercent.innerHTML = discount_amount;

        oldPrice.style.display = 'block';
    }

    setCoupon(discount_amount){
        calcOption.memoryStates.discount_amount = discount_amount;
        this.showDiscount(discount_amount);
        this.displayPrice();
    }

	//====== const OPTION_WIDTH = this.calcLogic.getStyleRuleValue('width', '.range-labels__step'); ======
	//====== const OPTION_WIDTH = 5px; =============
	getStyleRuleValue(style, selector, sheet) {
		let sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
		for (let i = 0, l = sheets.length; i < l; i++) {
			let sheet = sheets[i];
			if (!sheet.cssRules) {
				continue;
			}
			for (let j = 0, k = sheet.cssRules.length; j < k; j++) {
				let rule = sheet.cssRules[j];
				if (rule.selectorText && rule.selectorText.split(',').indexOf(selector) !== -1) {
					return rule.style[style];
				}
			}
		}
		return '5px';
	}

}