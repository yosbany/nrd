import BaseView from './base-view.js';

export default class PrintPriceView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "print-price.html", "app");
        this.setPageTitleAndHeader("Imprimir Precio");
        this.initEventView();
    }

    initEventView() {

    }
}