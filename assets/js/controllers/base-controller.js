import { redirectTo } from '../util.js'

export default class BaseController {
    constructor() {

    }

    subscribeEvent(keyEvent, functionEvent){
        document.addEventListener(keyEvent, (event) => {
            functionEvent(event);
          });
    }

    redirectToPage(path) {
        redirectTo(path);
    }
}