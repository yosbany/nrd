import CodiguerasModel from './CodiguerasModel.js';
import ProductsModel from './ProductsModel.js';
import PurchaseOrdersModel from './PurchaseOrdersModel.js';
import PurchasePricesModel from './PurchasePricesModel.js';
import SuppliersModel from './SuppliersModel.js';
import UsersModel from './UsersModel.js';




const GetCollectionModelMap = () => {
    return {
        'Products': ProductsModel,
        'PurchaseOrders': PurchaseOrdersModel,
        'PurchasePrices': PurchasePricesModel,
        'Suppliers': SuppliersModel,
        'Users': UsersModel,
        'Codebreakers': CodiguerasModel
    };
}

export default GetCollectionModelMap;