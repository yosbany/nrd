import BaseController from './base-controller.js';
import ReceiveOrderView from '../views/receive-order-view.js';

export default class ReceiveOrderController extends BaseController {
    constructor() {
        super();
        this.view = new ReceiveOrderView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async receiveOrder() {
        console.log("ReceiveOrderController receiveOrder");
    }
}
