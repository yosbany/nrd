import BaseView from './base-view.js';

export default class MakeOrderView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "make-order.html", "app");
        this.initEventView();
    }

    initEventView() {

    }


}