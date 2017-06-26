class CalcOption{
	constructor(){
		this.options = {
			styleSheets: false,
			mySheet: ""
		};

		this.defaultsOptions = {
			'countPages': 1,
			'price': 0,
			'minPages': 1,
			'maxPages': 30,
			'dsc': ''
			// 'typeOfUnits': 'page',
			// 'siteApiUrl': 'https://api.yoursite.com/',
			// 'siteUrl': 'https://yoursite.com/',
			// 'servicesTree': [1039, 1040, 1038, 1055],
			// 'webSiteId': 123,
			// 'rangeColorChecked': "#319060",
			// 'rangeColor': "#fff"
		};

		this.memoryStates = {
			service: 'name',
			level: 'name',
			deadline: '15 days +',
			discount_amount: '0'
		};

		this.rangerStates = {
			index: 1
		};

		this.dataFormatting = {};

        this.servicesFormatting = {};
    }

    setInitialMemoryStatesDeadline(serviceTree) {
        const service = Object.keys(serviceTree)[0];
        const level = Object.keys(serviceTree[service].level)[0];
        const deadlines = Object.keys(serviceTree[service].level[level].deadline);
        const deadline = deadlines[deadlines.length - 1];
        /* do not set the values because of breaking functionality select first service on init */
        // this.memoryStates.service = service;
        // this.memoryStates.level = level;
        this.memoryStates.deadline = deadline;
    }

    setDefaultMemoryStates() {

        let services = Object.keys(this.dataFormatting);
        let defaultService = services[0];
        let serviceTree = calcOption.dataFormatting[defaultService];
        this.refreshMemoryStates(serviceTree);
    }
    refreshMemoryStates(service){
        let level = service.level[Object.keys(service.level)[0].toString()];
        let deadlines = Object.keys(service.level[level.name].deadline);
        let lastDeadline = deadlines[deadlines.length - 1];
        let deadline = level.deadline[lastDeadline];

        Object.assign(this.memoryStates, {
            service: service.name,
            level: level.name,
            deadline: deadline.name,
            minPages: +deadline.min_pages,
            maxPages: +deadline.max_pages,
            price: +deadline.price
        });
    }
	getDefaultOptions(){return this.defaultsOptions}
	getDataFormatting(){return this.dataFormatting;}
	getServicesFormatting(){return this.servicesFormatting;}

	setOptions(newOption){
		Object.assign(this.defaultsOptions, newOption);
	}
}

export let calcOption = new CalcOption();