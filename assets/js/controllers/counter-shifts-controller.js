import BaseController from './base-controller.js';

export default class CounterShiftsController extends BaseController {
    constructor() {
        super();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async counterShifts() {
        console.log("CounterShiftsController counterShifts");
    }
}