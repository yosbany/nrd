import BaseView from './base-view.js';

export default class HomeView extends BaseView {

    constructor() {
        super();
    }
    
    home() {
        this.fetchAndSetHTML("./assets/js/views/fragments/home.html", "app");
    }

   
}