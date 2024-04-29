import BaseController from './base-controller.js';

export default class PurchasePriceController  extends BaseController{
    constructor() {
        super();
    }

    async purchasePrice() {
        console.log("PurchasePriceController purchasePrice");
    }
}
