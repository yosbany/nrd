import { redirectTo } from '../util.js'

export default class BaseController {
    constructor() {

    }

    redirectToPage(path) {
        redirectTo(path);
    }
}