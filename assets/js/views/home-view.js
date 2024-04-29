import BaseView from './base-view.js';

export default class HomeView extends BaseView {
    constructor() {
        super();
    }
    
    render() {
        console.log("HomeView render");
        this.fetchAndSetHTML("./fragments/home.html", "app");
    }
}