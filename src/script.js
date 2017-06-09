import { ComponentsBuilder } from './componentsBuilder';
import { Api } from './api/apiScript.js';
import { generalOptions } from './generalOtions/generalOptions';
import {helper} from './helper/helper';
new Api();
new ComponentsBuilder();

try {
    document.body.style.background = 'black';
    if (helper.isIE()) {
        let head  = document.getElementsByTagName('head')[0];
        let style  = document.createElement('style');
        let styleContent = `
        .range input {
            top: -37px;
            height: 40px;
        }
        `;
        style.innerHTML = styleContent;
        head.appendChild(style);
    }
} catch (e) {
    throw e;
}
