import BaseView from './base-view.js';

export default class PurchasePlanView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "purchase-plan.html", "app");
        this.initEventView();
    }

    initEventView() {

    }
}