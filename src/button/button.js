import { generalOptions } from '../generalOtions/generalOptions';

export class CustomButton{
    constructor(element, options){
        this.options = options;
        this.type = (!!this.options.type) ? this.options.type : 'order';
        this.AdditionalQuery = [];
        this.link = `${generalOptions.siteMyUrl}/${this.options.type}.html`;

        element.onclick = (e) => {
            e.preventDefault();
            this.setParams();
            this.setQuery();
            location.href = this.link;
        }
    }

    setParams(){
        if (generalOptions.apiMode !== 'M') {
            this.AdditionalQuery.push({
                'rid' : generalOptions.rid
            });
        }
    }
    setQuery(){
        for (let i = 0; i < this.AdditionalQuery.length; i++){
            let key = Object.keys(this.AdditionalQuery[i])[0];
            if ( i == 0) {
                this.link += `?${key}=${this.AdditionalQuery[i][key]}`;
            } else {
                this.link += `&${key}=${this.AdditionalQuery[i][key]}`;
            }
        }
    }

}