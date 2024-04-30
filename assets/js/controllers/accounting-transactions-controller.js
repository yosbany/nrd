import BaseController from './base-controller.js';
import AccountingTransactionsView from '../views/accounting-transactions-view.js';

export default class AccountingTransactionsController extends BaseController {
    constructor() {
        super();
        this.view = new AccountingTransactionsView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async accountingTransactions() {
        console.log("AccountingTransactionsController accountingTransactions");
        
    }
}
