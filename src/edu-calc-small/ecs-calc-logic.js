import {dataFactory} from "../dataFactory/dataFactory";

export class CalcLogic {
	constructor(calcID, calcOption) {
		this.calcOption = calcOption;
		this.calcID = calcID;
	}

	checkCountPage() {
		let $inputCountPages = document.querySelector(`#${this.calcID} .ecs__page-input`);
		let countPages = $inputCountPages.value;
        let $elementPagesSub = document.querySelector(`#${this.calcID} .ecs__page--subtitle`);

		if (countPages > this.calcOption.memoryStates.maxPages) {
			$inputCountPages.setAttribute("value", this.calcOption.memoryStates.maxPages.toString());
			$inputCountPages.setAttribute("max", this.calcOption.memoryStates.maxPages.toString());
			$inputCountPages.value = this.calcOption.memoryStates.maxPages;
			this.calcOption.memoryStates.countPages = this.calcOption.memoryStates.maxPages;

		} else {
            $inputCountPages.setAttribute("max", this.calcOption.memoryStates.maxPages.toString());
		}
        $elementPagesSub.innerHTML = (this.calcOption.memoryStates.countPages == 1) ? 'page' : 'pages';
	}
    setCountPages() {
        let $elementPlus = document.querySelector(`#${this.calcID} .ecs__plus-btn`);
        let $elementMinus = document.querySelector(`#${this.calcID} .ecs__minus-btn`);
        let $elementTarget = document.querySelector(`#${this.calcID} .ecs__page-input`);
        let $elementPagesSub = document.querySelector(`#${this.calcID} .ecs__page--subtitle`);
        $elementPlus.addEventListener("click", refreshTarget.bind(this, "plus"));
        $elementMinus.addEventListener("click", refreshTarget.bind(this, "minus"));

        this.checkCountPage();
        this.displayPrice();
        function refreshTarget(incOrDec) {

            if (incOrDec == "plus" && this.calcOption.memoryStates.countPages < (this.calcOption.memoryStates.maxPages || 30)) {
                this.calcOption.memoryStates.countPages = +this.calcOption.memoryStates.countPages + 1;
                $elementPagesSub.innerHTML = (this.calcOption.memoryStates.countPages == 1) ? 'page' : 'pages';
                $elementTarget.value = this.calcOption.memoryStates.countPages;
            } else if (incOrDec == "minus" && this.calcOption.memoryStates.countPages > (this.calcOption.memoryStates.minPages || 1)) {
                this.calcOption.memoryStates.countPages -= 1;
                $elementPagesSub.innerHTML = (this.calcOption.memoryStates.countPages == 1) ? 'page' : 'pages';
                $elementTarget.value = this.calcOption.memoryStates.countPages;
            }
            this.checkCountPage();
            this.displayPrice();
        }
    }

	getPrice(){
		this.calcOption.memoryStates.price = dataFactory.servicesTrees[this.calcOption.memoryStates.service]
			.level[this.calcOption.memoryStates.level]
			.deadline[this.calcOption.memoryStates.deadline]
			.price;

		let estimatePrice = this.calcOption.memoryStates.price * this.calcOption.memoryStates.countPages;

		return estimatePrice.toFixed(2);
	}
	getPriceWithDiscount(){
		let coef = 1 - (this.calcOption.memoryStates.discount_amount / 100);
		let newPrice = this.getPrice() * coef;
		return newPrice.toFixed(2);
	}
	displayPrice() {
		let $displayPrice = document.querySelector(`#${this.calcID} .ecs__price__value`);
        let $oldPrice = document.querySelector(`#${this.calcID} .ecs__price__old`);
        let $oldPriceLine = document.querySelector(`#${this.calcID} .ecs__price__old__line`);

        if (this.calcOption.memoryStates.discount_amount > 0){
        	$oldPrice.innerHTML = this.getPrice();
        	$displayPrice.innerHTML = this.getPriceWithDiscount();
			this.moveCrossLine();
		} else {
            $displayPrice.innerHTML = this.getPrice();
		}

	}
	moveCrossLine(){
        let $oldPrice = document.querySelector(`#${this.calcID} .ecs__price__old`);
        let $oldPriceLine = document.querySelector(`#${this.calcID} .ecs__price__old__line`);

        $oldPriceLine.style.top = `${$oldPrice.offsetTop + $oldPrice.clientHeight *  0.5 - 5}px`;
        $oldPriceLine.style.left = `${$oldPrice.offsetLeft - 3}px`;
        $oldPriceLine.style.width = `${$oldPrice.offsetWidth + 6}px`;
	}

	hideDiscount(){
		let oldPrice = document.querySelector(`#${this.calcID} .ecs__price__old`);
        let oldPriceLine = document.querySelector(`#${this.calcID} .ecs__price__old__line`);
        this.calcTitleWithoutDsc = document.querySelector(`#${this.calcID} .ecs__title--hidden-dsc`);
        this.calcTitleWithDsc = document.querySelector(`#${this.calcID} .ecs__title--shown-dsc`);
        if (this.calcTitleWithoutDsc) this.calcTitleWithoutDsc.style.display = 'block';
        if (this.calcTitleWithDsc) this.calcTitleWithDsc.style.display = 'none';
        oldPrice.style.display = 'none';
        oldPriceLine.style.display = 'none';
	}
    showDiscount(discount_amount){
        this.oldPrice = document.querySelector(`#${this.calcID} .ecs__price__old`);
        this.oldPriceLine = document.querySelector(`#${this.calcID} .ecs__price__old__line`);

        this.calcTitleWithoutDsc = document.querySelector(`#${this.calcID} .ecs__title--hidden-dsc`);
        this.calcTitleWithDsc = document.querySelector(`#${this.calcID} .ecs__title--shown-dsc`);
        this.dscPercent = document.querySelector(`#${this.calcID} .ecs__title_dsc-percent`);

        if (this.calcTitleWithoutDsc) {
            this.calcTitleWithoutDsc.style.display = 'none';
        }

        if (this.calcTitleWithDsc) {
            this.calcTitleWithDsc.style.display = 'block';
        }

        if (this.dscPercent) {
            this.dscPercent.textContent = discount_amount;
        }

        this.oldPrice.style.display = 'inline-block';
        this.oldPriceLine.style.display = 'inline-block';
    }
    setCoupon(discount_amount){
       this.calcOption.memoryStates.discount_amount = discount_amount;
       try {
           this.showDiscount(discount_amount);
       } catch (err){
           setTimeout(()=>{
               this.showDiscount(discount_amount);
           },8000)
       }
       this.displayPrice();
    }
    setListsTopPositions(){
        this.serviceList	= document.querySelector(`#${this.calcID} .ecs__list__wrapper--service`);
        this.levelList 		= document.querySelector(`#${this.calcID} .ecs__list__wrapper--level`);
        this.deadlineList 	= document.querySelector(`#${this.calcID} .ecs__list__wrapper--deadline`);
        let serviceWrapper	= document.querySelector(`#${this.calcID} .ecs__service`);
        let levelWrapper 		= document.querySelector(`#${this.calcID} .ecs__level`);
        let deadlineWrapper 	= document.querySelector(`#${this.calcID} .ecs__deadline`);

        this.serviceList.style.top = `${serviceWrapper.offsetTop + serviceWrapper.clientHeight *  0.5}px`;
        this.levelList.style.top = `${levelWrapper.offsetTop + levelWrapper.clientHeight *  0.5}px`;
        this.deadlineList.style.top = `${deadlineWrapper.offsetTop + deadlineWrapper.clientHeight *  0.5}px`;
        this.serviceList.style.left = `${serviceWrapper.offsetLeft}px`;
        this.levelList.style.left = `${levelWrapper.offsetLeft}px`;
        this.deadlineList.style.left = `${deadlineWrapper.offsetLeft}px`;
    }



}