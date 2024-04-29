import BaseController from './base-controller.js';

export default class PostersController extends BaseController {
    constructor() {
        super();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async posters() {
        console.log("PostersController posters");
    }
}
