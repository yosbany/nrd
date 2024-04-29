import { redirectTo } from '../util.js'

export default class BaseController {
    constructor() {
        // Constructor de BaseController
    }

    redirectTo(path){
        redirectTo(path);
    }
}