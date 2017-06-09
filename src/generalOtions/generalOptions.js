import {helper} from '../helper/helper';

let hostname = '99papers.com';
let generalOptions = {
    'hostname': hostname,
    'rangeColorChecked': "#ffed7b", //for main calculator
    'rangeColor': "#23e1ca", //for main calculator
    'website_id': 432,
    'service_ids': '1674, 1675, 1673, 1690', //this services will show at table and main calculator as main buttons
    'apiMode': 'S',
    'discount_amount': '0',
};
if (eduOptions) {
    Object.assign(generalOptions, eduOptions)
}

if (generalOptions.dev_mode) {
    generalOptions.siteApiUrl = `https://devapi.${generalOptions.hostname}`;
    generalOptions.siteMyUrl = `https://devmy.${generalOptions.hostname}`;
} else {
    generalOptions.siteApiUrl = `https://api.${generalOptions.hostname}`;
    generalOptions.siteMyUrl = `https://my.${generalOptions.hostname}`;
}


export {generalOptions};