import BaseView from './base-view.js';

export default class OnlineCatalogView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "online-catalog.html", "app");
        this.setPageTitleAndHeader("Catálogo en Línea");
        this.initEventView();
    }

    initEventView() {

    }


}