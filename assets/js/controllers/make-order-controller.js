import BaseController from './base-controller.js';
import MakeOrderView from '../views/make-order-view.js';
import LocalStorageModel from '../models/local-storage-model.js';
import NrdApiModel from '../models/nrd-api-model.js/index.js';


export default class MakeOrderController extends BaseController {
    constructor() {
        super();
        this.view = new MakeOrderView(); 
        this.localStorageModel = new LocalStorageModel();
        this.nrdApiModel = new NrdApiModel();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async makeOrder() {
        console.log("MakeOrderController makeOrder");
        this.view.renderView();
        this.testApi();
    }

    async testApi(){
        const codes = await this.nrdApiModel.getAllCodes();
        console.log('Todos los códigos:', codes);

        const newCode = await this.nrdApiModel.addCode('nuevo_code', '{"campo": "valor"}');
        console.log('Nuevo código añadido:', newCode);

        const codeData = await this.nrdApiModel.getCodeData('nuevo_code');
        console.log('Datos del código nuevo_code:', codeData);

        const updatedCode = await this.nrdApiModel.updateCode('nuevo_code', '{"campo": "valor_actualizado"}');
        console.log('Código actualizado:', updatedCode);

        const deletedCode = await this.nrdApiModel.deleteCode('nuevo_code');
        console.log('Código eliminado:', deletedCode);
    }

}


