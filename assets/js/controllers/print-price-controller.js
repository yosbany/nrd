import BaseController from './base-controller.js';

export default class PrintPriceController extends BaseController {
    constructor() {
        super();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async printPrice() {
        console.log("PrintPriceController printPrice");
    }
}
