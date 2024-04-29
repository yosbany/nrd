import { redirectTo } from '../util.js'

export default class BaseController extends BaseController {
    constructor() {

    }

    redirectToPage(path) {
        redirectTo(path);
    }
}