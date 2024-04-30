import BaseController from './base-controller.js';
import PurchasePriceView from '../views/purchase-price-view.js';

export default class PurchasePriceController  extends BaseController{
    constructor() {
        super();
        this.view = new PurchasePriceView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async purchasePrice() {
        console.log("PurchasePriceController purchasePrice");
        this.view.renderView();
    }
}
