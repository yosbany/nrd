import BaseController from './base-controller.js';

export default class PrintPriceController extends BaseController {
    constructor() {
        super();
    }

    async printPrice() {
        console.log("PrintPriceController printPrice");
    }
}
