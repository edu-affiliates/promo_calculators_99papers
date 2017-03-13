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
			'typeOfUnits': 'page',
			'siteApiUrl': 'https://yoursite.com/',
			'siteUrl': 'https://yoursite.com/',
			'servicesTree': [1039, 1040, 1038, 1055],
			'webSiteId': 123,
			'rangeColorChecked': "#319060",
			'rangeColor': "#fff"
		};

		this.memoryStates = {
			service: 'Essay',
			level: 'High School',
			deadline: '15 days +',
			countPages: 1,
			minPages: 1,
			maxPages: 30,
			price: 9
		};


		this.rangerStates = {
			index: 1
		};

		this.dataFormatting = {};

		this.servicesFormatting = {};
	}
	setDefaultMemoryStates(){
        let services = Object.keys(this.dataFormatting);
        let defaultService = this.memoryStates.service || services[services.length - 1];
        let serviceTree = calcOption.dataFormatting[defaultService];
        this.refreshMemoryStates(serviceTree);
	}

	refreshMemoryStates(service){

		// console.log(service);
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
    refreshDeadlineStates(deadline){
        Object.assign(this.memoryStates, {
            deadline: deadline.name,
            minPages: +deadline.min_pages,
            maxPages: +deadline.max_pages,
            price: +deadline.price
        });

    }
	setOptions(newOption){
		Object.assign(this.defaultsOptions, newOption);
	}
	setFormattings(dataFormatting, servicesFormatting){
		this.dataFormatting = dataFormatting;
		this.servicesFormatting = servicesFormatting;
	}
}

export let calcOption = new CalcOption();