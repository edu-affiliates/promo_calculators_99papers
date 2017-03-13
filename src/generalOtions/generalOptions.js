

let hostname = '99papers.com';
let generalOptions = {
    'hostname': hostname,
    'rangeColorChecked': "#ffed7b", //for main calculator
    'rangeColor': "#23e1ca", //for main calculator
    'website_id': 432,
    'service_ids': '1674, 1675, 1673, 1690', //this services will show at table and main calculator as main buttons
    'apiMode': 'S',
    // 'rid': "1228"
};
if (eduOptions) {
    Object.assign(generalOptions, eduOptions)
}
function getApiURL(mainDomain) {
    let URL = (isDev()) ? `https://devapi.${mainDomain}` : `https://api.${mainDomain}`;
    return URL;
}
function getMyURL(mainDomain) {
    let URL = (isDev()) ? `https://devmy.${mainDomain}` : `https://my.${mainDomain}`;
    return URL;
}

function isDev() {
    let splitedHostname = window.location.hostname.split(".");
    let isDev = (splitedHostname.indexOf('dev') > -1) || (splitedHostname.indexOf('localhost') > -1) || (splitedHostname.indexOf('localtunnel') > -1);
    return isDev;

}
generalOptions.siteApiUrl = getApiURL(generalOptions.hostname);
generalOptions.siteMyUrl = getMyURL(generalOptions.hostname);



export {generalOptions};