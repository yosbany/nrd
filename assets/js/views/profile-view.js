import BaseView from './base-view.js';

export default class ProfileView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "profile.html", "app");
        this.setPageTitleAndHeader("Perfil");
        this.initEventView();
    }

    initEventView() {

    }
}