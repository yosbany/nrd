import BaseView from './base-view.js';

export default class ReceiveOrderView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "receive-order.html", "app");
        this.setPageTitleAndHeader("Recibir Pedido");
        this.initEventView();
    }

    initEventView() {

    }
}