import BaseView from './base-view.js';

export default class HomeView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "home.html", "app");
        this.setPageTitleAndHeader("Inicio");
        this.initEventView();
    }

    initEventView() {

    }


}