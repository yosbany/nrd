import BaseView from './base-view.js';

export default class AccountingTransactionsView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "accounting-transactions.html", "app");
        this.initEventView();
    }

    initEventView() {

    }


}