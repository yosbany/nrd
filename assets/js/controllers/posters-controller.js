import BaseController from './base-controller.js';
import PostersView from '../views/posters-view.js';

export default class PostersController extends BaseController {
    constructor() {
        super();
        this.view = new PostersView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async posters() {
        console.log("PostersController posters");
        this.view.renderView();
    }
}
