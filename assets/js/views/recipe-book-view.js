import BaseView from './base-view.js';

export default class RecipeBookView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "recipe-book.html", "app");
        this.setPageTitleAndHeader("Recetario");
        this.initEventView();
    }

    initEventView() {

    }
}