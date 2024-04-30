import BaseView from './base-view.js';

export default class RrhhView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "rrhh.html", "app");
        this.initEventView();
    }

    initEventView() {

    }
}