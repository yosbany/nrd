import BaseView from './base-view.js';

export default class BudgetLunchView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "budget-lunch.html", "app");
        this.setPageTitleAndHeader("Presupuestar Lunch");
        this.initEventView();
    }

    initEventView() {

    }


}