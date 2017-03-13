import { generalOptions } from '../generalOtions/generalOptions';

class Helper{
    constructor(){

    }
    sortList($inputElement, $services) {
        let filter = $inputElement.value.toUpperCase();
        for (let service of $services){
            let serviceText = service.innerHTML.toUpperCase();
            if (serviceText.indexOf(filter) > -1) {
                service.style.display = "";
            } else service.style.display = "none";
        }
    }
    inputLengthFilter(string, max=20, sliceTo=15){
        let filteredString = (string.length > max) ? string.slice(0, sliceTo)+"..." : string;
        return filteredString
    }
    getApiURL(mainDomain) {
        let URL = (this.isDev()) ? `https://devapi.${mainDomain}` : `https://api.${mainDomain}`;
        return URL;
    }
    getMyURL(mainDomain) {
        let URL = (this.isDev()) ? `https://devmy.${mainDomain}` : `https://my.${mainDomain}`;
        return URL;
    }

    isDev() {
        let splitedHostname = window.location.hostname.split(".");
        let isDev = (splitedHostname.indexOf('dev') > -1) || (splitedHostname.indexOf('localhost') > -1);
        return isDev;

    }

   getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    setCookie(cname, cvalue, exdays) {
    var expires;
    if (exdays > 0) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        expires = "expires=" + d.toUTCString();
    } else {
        expires = 0;
    }
    let newCookie = cname + "=" + cvalue + "; " + expires + "; path=/; domain=."+generalOptions.hostname+";";
    document.cookie = newCookie;
};
}
export let helper = new Helper();