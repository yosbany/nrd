import BaseController from './base-controller.js';
import OnlineCatalogView from '../views/online-catalog-view.js';

export default class OnlineCatalogController extends BaseController {
    constructor() {
        super();
        this.view = new OnlineCatalogView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async onlineCatalog() {
        console.log("OnlineCatalogController onlineCatalog");
        this.view.renderView();
    }
}
