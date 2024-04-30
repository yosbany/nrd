import BaseController from './base-controller.js';
import PurchasePlanView from '../views/purchase-plan-view.js';

export default class PurchasePlanController extends BaseController {
    constructor() {
        super();
        this.view = new PurchasePlanView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async purchasePlan() {
        console.log("PurchasePlanController purchasePlan");
    }
}
