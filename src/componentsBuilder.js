import { calcBuild } from "./calc/calc-build";
import { dataFactory } from "./dataFactory/dataFactory";
import { generalOptions } from './generalOtions/generalOptions';
import { calcOption } from "./calc/calc-option";
import { calcOption as smallCalcOption } from "./edu-calc-small/ecs-calc-option"
import { calcBuild as smallCalcBuild } from "./edu-calc-small/ecs-calc-build";
import { tableRender } from './table-render/tableRender';
import { FastOrder } from './fast-order/fast-order';


class ComponentsBuilder{
    constructor(){
        this.calcBuild = calcBuild;
        this.dataFactory = dataFactory;
        this.smallCalcBuild = smallCalcBuild;
    };
    init(){
        dataFactory.getData(generalOptions.service_ids).done(response => {
            dataFactory.saveData(response);
            if (!!document.querySelector(".edu-calc")) this.buildBigCalculator();
            if (!!document.querySelector('.ecs')) this.buildSmallCalculator();
            if (!!document.querySelector("#renderTable")) this.buildTable();
            document.querySelectorAll('.edu-fast').forEach(element => {
                if (element.id !== null ) new FastOrder( element.id )
            });
        });
    };
    buildBigCalculator(){
        Object.assign(calcOption.defaultsOptions, generalOptions);
        this.calcBuild.buildDomCalc("edu-calc");
        this.calcBuild.buildButtons();
    };
    buildSmallCalculator(){
        Object.assign(smallCalcOption.defaultsOptions, generalOptions);
        this.smallCalcBuild.buildDomCalc();
        this.smallCalcBuild.build();
    };

    buildTable() {
        tableRender.render(dataFactory.servicesTrees['Essay']);
    }

}

export let componentsBuilder = new ComponentsBuilder;