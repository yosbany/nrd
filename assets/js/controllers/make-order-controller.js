import BaseController from './base-controller.js';
import MakeOrderView from '../views/make-order-view.js';
import LocalStorageModel from '../models/local-storage-model.js';
import FirebaseServiceInstance from '../../../services/firebase-service.js';



export default class MakeOrderController extends BaseController {
    constructor() {
        super();
        this.view = new MakeOrderView(); 
        this.localStorageModel = new LocalStorageModel();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async makeOrder() {
        console.log("MakeOrderController makeOrder");
        const proveedores = await FirebaseServiceInstance.getData("proveedores")
        this.view.renderView(proveedores);
        
    }


}


