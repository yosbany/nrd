import BaseController from './base-controller.js';

export default class OnlineCatalogController extends BaseController {
    constructor() {
        super();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async onlineCatalog() {
        console.log("OnlineCatalogController onlineCatalog");
    }
}
