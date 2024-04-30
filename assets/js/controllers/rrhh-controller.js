import BaseController from './base-controller.js';
import RrhhView from '../views/rrhh-view.js';

export default class RrhhController extends BaseController {
    constructor() {
        super();
        this.view = new RrhhView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async rrhh() {
        console.log("RrhhController rrhh");
        this.view.renderView();
    }
}
