import BaseModel from '../../core/BaseModel.js';
import FirebaseDatabase from '../services/FirebaseDatabase.js';
import CodiguerasModel from './CodiguerasModel.js';
import GetCollectionModelMap from './GetCollectionModelMap.js';

const PurchasePricesModel = {
    collection: 'PurchasePrices',
    schema: {
        productKey: {
            type: "string",
            default: null,
            entity: "Products",
            constraints: {
                required: true
            }
        },
        unitPrice: {
            type: "number",
            default: 0
        },
        date: {
            type: "date",
            default: new Date(),
            constraints: {
                required: true
            }
        },
        supplierKey: {
            type: "string",
            default: null,
            entity: "Suppliers"
        },
        supplierProductName: {
            type: "string",
            default: "",
            constraints: {
                required: false
            }
        },
        purchasePackaging: {
            type: "string",
            default: "UN",
            constraints: {
                required: true,
                enum: async () => await CodiguerasModel.getParentOptions("Unidades de Medidas")
            }
        },
        supplierProductCode: {
            type: "string",
            default: "",
            constraints: {
                required: false
            }
        },
        packagingConversion: {
            type: "number",
            default: 1,
            constraints: {
                required: true,
                min: 0.001
            }
        }
    },

    async findById(id) {
        let data = await FirebaseDatabase.findById(id);
        if (data) {
            data = BaseModel.transformDataAfterFetch(data, this.schema, GetCollectionModelMap());
        }
        return data;
    },

    async findAll() {
        let data = await FirebaseDatabase.findAll(this.collection);
        if (data) {
            data = await Promise.all(
                data.map(item => BaseModel.transformDataAfterFetch(item, this.schema, GetCollectionModelMap()))
            );
        }
        return data;
    },

    async save(id, data) {
        BaseModel.validateData(data, this.schema);
        const transformedData = BaseModel.transformDataBeforeSave(data, this.schema);
        return await FirebaseDatabase.save(this.collection, id, transformedData);
    },

    async delete(id) {
        return await FirebaseDatabase.delete(id);
    },

    validateForm(data) {
        try {
            BaseModel.validateData(data, PurchasePricesModel.schema);
            return null; 
        } catch (errors) {
            return errors; 
        }
    },

    async createDefaultInstance(){
        return BaseModel.createDefaultInstance(PurchasePricesModel.schema);
    },
    async findBySupplier(supplierKey) {
        const allPurchasePrices = await PurchasePricesModel.findAll();
        return allPurchasePrices.filter(price => price.supplierKey === supplierKey);
    },
};

export default PurchasePricesModel;
