import BaseView from './base-view.js';

export default class CounterShiftsView extends BaseView {

    constructor() {
        super();
    }

    async renderView() {
        await this.fetchAndSetHTML(this.PATH_FRAGMENTS + "counter-shifts.html", "app");
        this.setPageTitleAndHeader("Turnos Mostrador");
        this.initEventView();
    }

    initEventView() {

    }


}