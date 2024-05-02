import BaseController from './base-controller.js';
import PurchasePriceView from '../views/purchase-price-view.js';
import XmlProcessorModel from '../models/xml-processor-model.js';
import LocalStorageModel from '../models/local-storage-model.js';



export default class PurchasePriceController  extends BaseController{
    constructor() {
        super();
        this.view = new PurchasePriceView();
        this.xmlProcessorModel = new XmlProcessorModel("assets/xml/");
        this.localStorageModel = new LocalStorageModel();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async purchasePrice() {
        console.log("PurchasePriceController purchasePrice");
        this.view.renderView();
        let xmls = this.localStorageModel.getValue("xmls_dgi");
        let arrays = this.xmlProcessorModel.procesarListaXMLs(xmls);
        console.log(arrays);
    }
}
