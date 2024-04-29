import { redirectTo } from '../util.js'

export default class BaseController {
    constructor() {

    }

    redirectTo(path) {
        redirectTo(path);
    }
}