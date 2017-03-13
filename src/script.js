import { componentsBuilder } from './componentsBuilder';
import { generalOptions } from './generalOtions/generalOptions';
import { workWithApi } from './api/apiScript';


if (generalOptions.apiMode === 'M') workWithApi.init();
componentsBuilder.init();