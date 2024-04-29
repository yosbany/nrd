import { redirectToUtils } from '../util.js'

export default class BaseController {
    constructor() {

    }

    redirectToPage(path) {
        redirectToUtils(path);
    }
}