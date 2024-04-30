import BaseController from './base-controller.js';
import PrintPriceView from '../views/print-price-view.js';

export default class PrintPriceController extends BaseController {
    constructor() {
        super();
        this.view = new PrintPriceView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async printPrice() {
        console.log("PrintPriceController printPrice");
        this.view.renderView();
    }
}
