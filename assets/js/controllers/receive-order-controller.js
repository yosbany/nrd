import BaseController from './base-controller.js';

export default class ReceiveOrderController extends BaseController {
    constructor() {
        super();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async receiveOrder() {
        console.log("ReceiveOrderController receiveOrder");
    }
}
