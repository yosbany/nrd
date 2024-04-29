import BaseView from './base-view.js';

export default class HomeView extends BaseView {

    constructor() {
        super();
    }

     async renderView() {
         await this.fetchAndSetHTML("./assets/js/views/fragments/home.html", "app");
         this.initEvent();
    }

    initEvent(){

    }

   
}