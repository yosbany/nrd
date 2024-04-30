import BaseController from './base-controller.js';
import CounterShiftsView from '../views/counter-shifts-view.js';

export default class CounterShiftsController extends BaseController {
    constructor() {
        super();
        this.view = new CounterShiftsView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async counterShifts() {
        console.log("CounterShiftsController counterShifts");
    }
}