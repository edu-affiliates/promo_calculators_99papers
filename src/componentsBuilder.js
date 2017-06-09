import { calcBuild } from "./calc/calc-build";
import { dataFactory } from "./dataFactory/dataFactory";
import { generalOptions } from './generalOtions/generalOptions';
import { calcOption } from "./calc/calc-option";
import { SmallCalculator } from "./edu-calc-small/ecs-calc-build";
import { tableRender } from './table-render/tableRender';
import { FastOrder } from './fast-order/fast-order';
import { helper } from './helper/helper';
import { CustomButton } from './button/button';

export class ComponentsBuilder{
    constructor(){
        this.calcBuild = calcBuild;
        this.dataFactory = dataFactory;

        this.calculators = [];
        this.buildAllComponents = () => {

            return new Promise((resolve, reject)=>{
                try{
                    let ecsElements = document.querySelectorAll('.ecs');
                    let eduFastElements = document.querySelectorAll('.edu-fast');
                    let eduCustomBtns = document.querySelectorAll('.edu-custom-btn');


                    for(let eduFastElement of eduFastElements){
                        if (eduFastElement.id !== null ) new FastOrder( eduFastElement.id, eduFastElement.dataset)
                    }

                    for(let eduCustomBtn of eduCustomBtns){
                        new CustomButton(eduCustomBtn, eduCustomBtn.dataset);
                    }

                    for (let ecsElement of ecsElements) {
                        if (ecsElement.id !== null ) {
                            this.calculators.push(new SmallCalculator( ecsElement.id, ecsElement.dataset ))
                        }
                    }

                    if (!!document.querySelector(".edu-calc")) this.buildBigCalculator();
                    if (!!document.querySelector("#renderTable")) this.buildTable();
                    resolve('end');
                } catch(err) {
                    reject(err)
                }
            })

        };
        this.init();
    };
    init(){

        dataFactory.getData(generalOptions.service_ids)
            .then(response => {
                dataFactory.saveData(response);
                return response

            }).then(response => {
                this.buildAllComponents();

            }).then( start =>{
                let discount_code = (generalOptions.dev_mode) ? generalOptions.dsc : helper.getCookie('dsc');

                if (!!discount_code) {
                    dataFactory.checkCoupon(discount_code).then(discount_amount =>{
                        for (let calc of this.calculators){
                            generalOptions.dsc = discount_code;
                            generalOptions.discount_amount = discount_amount;
                            calc.calcLogic.setCoupon(discount_amount);
                        }
                    }).catch(err => {
                        console.log(err);
                        generalOptions.discount_amount = 0;
                        generalOptions.dsc = '';
                        for (let calc of this.calculators){
                            calc.calcLogic.hideDiscount();
                        }
                    });
                } else {
                    for (let calc of this.calculators){
                        calc.calcLogic.hideDiscount();
                    }
                }
            }).catch(err => console.log(err));
    };

    buildBigCalculator(){
        Object.assign(calcOption.defaultsOptions, generalOptions);
        let options = document.querySelector('.edu-calc').dataset;
        this.calcBuild.buildDomCalc("edu-calc", options);
        this.calcBuild.buildButtons(options);
        this.calculators.push(this.calcBuild);
    };

    buildTable() {
        tableRender.render(dataFactory.servicesTrees['Essay']);
    }

}

