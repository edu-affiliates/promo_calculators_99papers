import {dataFactory} from "../dataFactory/dataFactory";

export class CalcOption{
	constructor(options, smallCalc, calcID){
        this.calcID = calcID;

        this.defaultOptions = {};
		// Object.assign(this.defaultOptions, );
        for (let param of Object.keys(options)){
            this.defaultOptions[param] = options[param];
        }

		this.memoryStates = {
			service: 'Essay',
			level: 'High School',
			deadline: '15 days +',
			countPages: 1,
			minPages: 1,
			maxPages: 30,
			price: 9,
            discount_amount: 0
		};
		this.smallCalc = smallCalc;


	}

	hideDefaultsOptions(){
	    let isServiceDefault = Boolean(this.defaultOptions.constService);
        let isLevelDefault = Boolean(this.defaultOptions.constLevel);
        let isDeadlineDefault = Boolean(this.defaultOptions.constDeadline);
        let serviceSelected	= document.querySelector(`#${this.calcID} .ecs__service`);
        let levelSelected 		= document.querySelector(`#${this.calcID} .ecs__level`);
        let deadlineSelected 	= document.querySelector(`#${this.calcID} .ecs__deadline`);
        if (isServiceDefault) serviceSelected.style.display = 'none';
        if (isLevelDefault) levelSelected.style.display = 'none';
        if (isDeadlineDefault) deadlineSelected.style.display = 'none';
    }
	setDefaultMemoryStates(){

		let defaultService = this.defaultOptions.defaultService;
		let defaultLevel =  this.defaultOptions.defaultLevel;
        let defaultDeadline =  this.defaultOptions.defaultDeadline;
        // console.log(this.smallCalc);
        //try to set default service and get one from api in case of absent the one

        if (dataFactory.getSavedServicesAsList().indexOf(defaultService) >= 0) {
            this.memoryStates.service = defaultService;
            this.refreshLevelState(defaultLevel);
            this.refreshDeadlineStates(defaultDeadline);
            this.smallCalc.build();

        } else {
            let newServiceTree = {};
            if (dataFactory.getServicesAsList().indexOf(defaultService) >= 0){

                dataFactory.getData(dataFactory.servicesList[defaultService].id)
                    .then(response => {
                        dataFactory.sortedData(JSON.parse(response).info.services_tree, newServiceTree);
                        Object.assign(dataFactory.servicesTrees, newServiceTree);
                        this.memoryStates.service = defaultService;
                        this.refreshLevelState(defaultLevel);
                        this.refreshDeadlineStates(defaultDeadline);
                        this.smallCalc.build();
                    }).catch(err => console.log(err));
                //     .done(response => {
                //     //sort and save data to global storage
                //
                //
                //
                // }).fail(error => console.error(error));
            } else {

                console.log(`${defaultService} service doesn't exist, set first of exist services`);

                defaultService = dataFactory.getSavedServicesAsList()[0];
                this.memoryStates.service = dataFactory.servicesTrees[defaultService].name;
                this.refreshLevelState(defaultLevel);
                this.refreshDeadlineStates(defaultDeadline);
                console.log(this.smallCalc.build);
                this.smallCalc.build();

            }

        }
        // let levels = dataFactory.servicesTrees[this.memoryStates.service].level;
        // let levelsList = Object.keys(levels);
        // //try to set default level and set first in case of absent one
        // this.memoryStates.level = (defaultLevel in levelsList) ? defaultLevel : levelsList[0];
        //
        // let deadlines = dataFactory
        //     .servicesTrees[this.memoryStates.service]
        //     .level[this.memoryStates.level]
        //     .deadline;
        //
        // let deadlinesList = Object.keys(deadlines);
        // //try to set default level and set first in case of absent one
        // this.memoryStates.deadline = (defaultDeadline in deadlinesList) ? defaultDeadline : deadlinesList[deadlinesList.length - 1];
        // let deadlineTree = deadlines[this.memoryStates.deadlines];
        // this.refreshDeadlineStates(deadlineTree);
	}
    refreshLevelState(levelName){
        let levels = dataFactory.servicesTrees[this.memoryStates.service].level;

        let levelsList = Object.keys(levels);

        this.memoryStates.level = (levelsList.indexOf(levelName) >= 0) ? levelName : levelsList[0];
        return this.memoryStates.level;
    }

    refreshDeadlineStates(deadlineName){
        // let currentDeadline = this.memoryStates.deadline;
        let deadlines = dataFactory
            .servicesTrees[this.memoryStates.service]
            .level[this.memoryStates.level]
            .deadline;

        let deadlinesList = Object.keys(deadlines);

        this.memoryStates.deadline = (deadlinesList.indexOf(deadlineName) >= 0) ? deadlineName : deadlinesList[deadlinesList.length - 1];
        let deadline = deadlines[this.memoryStates.deadline];

        Object.assign(this.memoryStates, {
            deadline: deadline.name,
            minPages: +deadline.min_pages,
            maxPages: +deadline.max_pages,
            price: +deadline.price
        });
    }
	refreshMemoryStates(service){
        this.memoryStates.service = service;
        this.refreshLevelState(this.memoryStates.level);
        this.refreshDeadlineStates(this.memoryStates.deadline);
        // let deadlines = Object.keys(service.level[level.name].deadline);
        // let lastDeadline = deadlines[deadlines.length - 1];
        // let deadline = level.deadline[lastDeadline];
        //
        // Object.assign(this.memoryStates, {
        //     service: service.name,
        //     level: level.name,
        //     deadline: deadline.name,
        //     minPages: +deadline.min_pages,
        //     maxPages: +deadline.max_pages,
        //     price: +deadline.price
        // });
	}
    // refreshDeadlineStates(deadline){
    //     Object.assign(this.memoryStates, {
    //         deadline: deadline.name,
    //         minPages: +deadline.min_pages,
    //         maxPages: +deadline.max_pages,
    //         price: +deadline.price
    //     });
    //
    // }
    // setOptions(newOption){
		// Object.assign(this.defaultsOptions, newOption);
    // }

}

