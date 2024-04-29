import BaseController from './base-controller.js';

export default class PurchasePlanController extends BaseController {
    constructor() {
        super();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async purchasePlan() {
        console.log("PurchasePlanController purchasePlan");
    }
}
