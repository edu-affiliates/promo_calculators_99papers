import {calcEventListener} from "./calc-event-listner";
import {CalcLogic} from "./calc-logic";
import {calcOption} from "./calc-option";
import {dataFactory} from "../dataFactory/dataFactory";

class CalcBuild {
	constructor(CalcLogicClass) {
		this.calcLogic = CalcLogicClass;
	}

	buildDomCalc(elementID) {
		let refElem = document.getElementsByClassName(elementID)[0];

		let calc = `<div class="title-calculator">
			<p class="title-calculator__img"></p>Calculate your price
			</div>
			<div class="calculator clearfix">
			<form id="calc_buttons">
			<div class="calculator__type clearfix">
			<p>Type of Service:</p>
			<div class="calculator__type__select">Please select Type of Service</div>
			<div id="type_of_service"></div>
			</div>
			<div class="calculator__level clearfix">
			<p>Academic level:</p>
			<div class="calculator__level__select">Please select Type of Service first</div>
			<div id="acad-level"></div>
			</div>
			<div class="calculator__deadline clearfix">
			<p>Deadline:</p>
			<div class="calculator__deadline__select">Please select Discipline first</div>
			<div id="deadlines"></div>
			</div>
			<div class="calculator__pages clearfix">
			<p class="calc_anchor_number_pages">Number of Pages:</p>
			<div id="calc_anchor_number_pages" class="calculator__number" >
			<div class="calculator__number-minus" id="button-minus">-</div>
			<input type="number" class="calculator__number-target" id="button-target" min="1" max="30" value="1" />
			<div class="calculator__number-plus" id="button-plus">+</div>
			<div class="calculator__number-words"><span id="calc-word">275</span> words</div>
			</div>
			</div>
			<div class="calculator__cost clearfix">
			<p class="preliminary-cost">Estimate price</p>
			<p class="first-order__image"></p>
			<p class="first-order">First Order</p>
			<p class="first-order__discount"><span class="discount__border">15% discount<span></p>
			<div class="calculator__cost-usd">
			'$ <span id="discount-price">0.00</span>
			</div>
			<div class="calculator__cost-full"><span class="white-text">$ <span id="s_f_count_page">0.00</span></span>
			<div class="calculator__cost-full-before"></div></div>
			</div>
			<button class="calculator__inquiry-button">
			<div class="calculator__inquiry-button__text">Inquiry</div>
			</button>
			<button class="calculator__order-button">
			<span class="calculator__order-button__text">Order now</span>
			</button>
			</form>
			</div>`;

		refElem.insertAdjacentHTML("afterbegin", calc);

	};

	buildButtons() {
		this.renderButton("service");
		this.renderButton("level");
		this.renderRangeSlider();
		calcEventListener.eventsListner();
		this.calcLogic.setCountPages();
        document.querySelector("div[data-name='Essay']").click();
		document.querySelector("div[data-name='High School']").click();

	}

	renderButton(name, selectedName) {

		let $serviceButtons = document.createElement('div');
		let $section = document.getElementsByClassName("calculator__type")[0];

		if (name == "service") {
			renderServiceButtons();
		} else if (name == "level") {
			renderLevelButtons.call(this);
		}

		$section.appendChild($serviceButtons);

		this.renderListsNameService();

		function renderServiceButtons() {
			$serviceButtons.className = "calculator__type-button";
			$serviceButtons.id = "services__button";
			let elem = document.getElementsByClassName("calculator__type__select")[0];
			elem.style.display = "block";
			elem.innerHTML = 'Loading...';

			let buttonName = Object.keys(dataFactory.servicesTrees);

			for (let i = 0; i < 5; i++) {
				let $serviceButton = document.createElement('div');

				if (i == 4) {
					$serviceButton.innerHTML = "Choose Other";
					$serviceButton.dataset.name = "Choose Other";
				} else {
					$serviceButton.innerHTML = buttonName[i];
					$serviceButton.dataset.name = buttonName[i];
				}

				$serviceButtons.appendChild($serviceButton);
			}

			elem.style.display = "none";
		}

		function renderLevelButtons() {
			$serviceButtons.className = "calculator__level-button";
			$serviceButtons.id = "level__button";
			let elem = document.getElementsByClassName("calculator__level__select")[0];
			elem.innerHTML = 'Loading...';
			$section = document.getElementsByClassName("calculator__level")[0];

			if (!selectedName) {
				addTextToButtons(selectedName);

			} else {
				$serviceButtons = document.getElementById("level__button");
				$serviceButtons.innerHTML = "";
				addTextToButtons(selectedName);
				memoryColorButtonLevel(selectedName);

				this.renderRangeSlider(true);
			}

			elem.style.display = "none";
		}

		function addTextToButtons(selectedName = Object.keys(dataFactory.servicesTrees)[0]) {

			let arrayWithLevels = Object.keys(dataFactory.servicesTrees[selectedName].level);

			let widthScreen = document.body.offsetWidth;
			for (let i = 0; i < arrayWithLevels.length; i++) {
				let $serviceButton = document.createElement('div');

				shortName($serviceButton, i);

				$serviceButton.dataset.name = arrayWithLevels[i];
				$serviceButtons.appendChild($serviceButton);
			}

			function shortName($serviceButton, iteration) {
				if (arrayWithLevels[iteration] == "Undergraduate (1st and 2nd year)") {
					$serviceButton.innerHTML = "Undergrad. (yrs 1-2)";
				} else if (arrayWithLevels[iteration] == "Undergraduate (3rd and 4th year)") {
					$serviceButton.innerHTML = "Undergrad. (yrs 3-4)";
				} else {
					$serviceButton.innerHTML = arrayWithLevels[iteration];
                }
				return $serviceButton
			}
		}

		function memoryColorButtonLevel(selectedName) {
			let elementColorIndex = Object.keys(dataFactory.servicesTrees[selectedName].level).indexOf(calcOption.memoryStates.level);
			let elementSetColor = document.getElementById("level__button");
			if (elementColorIndex > 0) {
				elementSetColor.childNodes[elementColorIndex].classList.add("button__on-colors");
			} else if (elementColorIndex <= 0 && (calcOption.memoryStates.level != "name")) {
				elementSetColor.childNodes[0].classList.add("button__on-colors");
                let level = elementSetColor.childNodes[0].textContent;
                let under12 = "Undergraduate (1st and 2nd year)";
                let under34 = "Undergraduate (3rd and 4th year)";
                level = (level == "Undergrad. (yrs 1-2)") ? under12 : level;
                level = (level == "Undergrad. (yrs 3-4)") ? under34 : level;
				calcOption.memoryStates.level = level;
			}
		}
	};

	renderRangeSlider(render) {
		let $serviceButtons = document.createElement('div');
		$serviceButtons.className = "calculator__type-deadline";
		$serviceButtons.id = "deadline_select-button";

		let $divRange = document.createElement("p");
		let $rangeSlider = document.createElement("input");
		let listsDeadline;
		let lengthArray;

		if (render === true && calcOption.memoryStates.service != "name" && calcOption.memoryStates.service != "Choose Other" && calcOption.memoryStates.level != "name") {
			listsDeadline = Object.keys(dataFactory.servicesTrees[calcOption.memoryStates.service].level[calcOption.memoryStates.level].deadline).reverse();
			lengthArray = listsDeadline.length;
		} else {
			listsDeadline = Object.keys(dataFactory.servicesTrees["Essay"].level["High School"].deadline).reverse();
			lengthArray = listsDeadline.length;
		}
		let $elem = document.getElementsByClassName("calculator__deadline__select")[0];
		$elem.innerHTML = 'Loading...';
		let $section = document.getElementsByClassName("calculator__deadline")[0];

		setAttributeToRangeSlider($rangeSlider);

		$divRange.classList.add("range", "clearfix");

		let datalist = setSteplist.call(this, lengthArray);

		if (!document.getElementById('deadline_select-button')) {
			renderRangeText(listsDeadline);
			renderRangePopUp(listsDeadline);

			$divRange.appendChild($rangeSlider);
			$serviceButtons.appendChild($divRange);
			$serviceButtons.appendChild(datalist);

			$section.appendChild($serviceButtons);
			$elem.style.display = "none";
		}

		if (render === true) {
			let childNodes = Array.prototype.slice.call(datalist.childNodes);
			if (!childNodes[calcOption.rangerStates.index - 1]) {
				calcOption.rangerStates.index = calcOption.rangerStates.index - 1;
				$rangeSlider.setAttribute("value", calcOption.rangerStates.index);

				calcOption.memoryStates.deadline = listsDeadline[calcOption.rangerStates.index - 1];
			} else {
				$rangeSlider.setAttribute("value", calcOption.rangerStates.index);
			}

			this.calcLogic.colorRange(childNodes, calcOption.rangerStates.index);

		}
		calcEventListener.rangeEventsListner();

		function renderRangeText(textArray) {
			let $beforeRangeText = document.createElement("span");
			let $afterRangeText = document.createElement("span");
			$beforeRangeText.className = "range-before";
			$afterRangeText.className = "range-after";
			$beforeRangeText.textContent = textArray[0];
			$afterRangeText.textContent = textArray[(textArray.length - 1)];
			$divRange.appendChild($beforeRangeText);
			$divRange.appendChild($afterRangeText);
		}

		function renderRangePopUp(textArray) {
			let $renderRangePopUp = document.createElement("span");
			$renderRangePopUp.className = "range-popup";
			$renderRangePopUp.textContent = textArray[0];

			let $renderRangePopUpTriangle = document.createElement("span");
			$renderRangePopUpTriangle.className = "range-popup__triangle-left";
			$renderRangePopUp.appendChild($renderRangePopUpTriangle);

			$divRange.appendChild($renderRangePopUp);

			if (!!document.querySelector("span.range-popup")) {
				let marginLeft = document.querySelector("span.range-popup").style.marginLeft;
				$renderRangePopUp.style.marginLeft = marginLeft;
				if (calcOption.memoryStates.deadline != "name") {
					$renderRangePopUp.textContent = calcOption.memoryStates.deadline;
				}
			}
		}

		function setSteplist(lengthArray) {
			let datalist = document.createElement("div");
			const COEF = 100 / (lengthArray - 1);
			const OPTION_WIDTH = this.calcLogic.getStyleRuleValue('width', '.range-labels__step');

			datalist.id = "steplist";
			datalist.classList.add("range-labels", "clearfix");

			for (let i = 0; i < lengthArray; i++) {
				let option = document.createElement("div");
				option.id = "range" + i;
				option.style.position = 'absolute';
				option.classList.add("range-labels__step");

				if (!(i == 0)) {
					option.style.left = `calc(${ i * COEF }% - ${OPTION_WIDTH})`;
				}
				datalist.appendChild(option);
			}

			return datalist
		}

		function setAttributeToRangeSlider($rangeSlider) {
			$rangeSlider.setAttribute("type", "range");
			$rangeSlider.setAttribute("name", "rangeInput");
			$rangeSlider.setAttribute("min", "1");
			$rangeSlider.setAttribute("max", lengthArray);
			$rangeSlider.setAttribute("step", "1");
			$rangeSlider.setAttribute("value", "1");
			$rangeSlider.id = "range";
			return $rangeSlider
		}
	};

	renderListsNameService(show) {
		let $wrapper = document.createElement('div');
		let $select = document.createElement('div');
		let $find = document.createElement('input');
		let $section = document.getElementsByClassName("calculator__type")[0];

		$wrapper.classList.add("calculator__wrapper-services-list");

		$find.classList.add("calculator__sort-list");
		$find.placeholder = "Please Type the Name of Service";
		$find.type = "text";

		if (!document.querySelector("div.calculator__type-select")) {
			$select.classList.add("calculator__type-select");
			$select.setAttribute("id", "lists_service");

			Object.keys(dataFactory.servicesList).forEach(service => {
				let $selectOption = document.createElement('p');
				$selectOption.classList.add("calculator__select-option");
				$selectOption.setAttribute("data-id", dataFactory.servicesList[service].id);
				$selectOption.setAttribute("data-value", dataFactory.servicesList[service].name);
				$selectOption.innerHTML = dataFactory.servicesList[service].name;
				$select.appendChild($selectOption);
			});

			$wrapper.appendChild($find);
			$wrapper.appendChild($select);
			$section.appendChild($wrapper);
			$section.insertAdjacentHTML("beforeend", this.customServiceTemlate());

		}
	}

	customServiceTemlate() {
		return `<div class="calculator__custom-service clearfix">
					<p class="calculator__custom-service-name">Test</p>
					<p class="calculator__custom-service-cross">&#10005</p>
				</div>`;
	}
}

export let calcBuild = new CalcBuild(new CalcLogic());