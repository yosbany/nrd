import BaseController from './base-controller.js';

export default class AccountingTransactionsController extends BaseController {
    constructor() {
        super();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async accountingTransactions() {
        console.log("AccountingTransactionsController accountingTransactions");
        
    }
}
