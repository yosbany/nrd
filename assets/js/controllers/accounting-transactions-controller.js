import BaseController from './base-controller.js';
import AccountingTransactionsView from '../views/accounting-transactions-view.js';
import DataPersistenceModel from '../models/data-persistence-model.js';
DataPersistenceModel

export default class AccountingTransactionsController extends BaseController {
    constructor() {
        super();
        this.view = new AccountingTransactionsView(this);
        this.dataPersistenceModel = new DataPersistenceModel()
    }

    
    async accountingTransactions() {
        console.log("AccountingTransactionsController accountingTransactions");
        this.view.renderView();
        
    }

    async saveMovimiento(movimiento){
        await this.dataPersistenceModel.saveMovimiento(movimiento);
    }
}
