import BaseView from './base-view.js';

export default class PurchasePriceView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "purchase-price.html", "app");
        this.initEventView();
    }

    initEventView() {

    }
}