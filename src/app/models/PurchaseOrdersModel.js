import BaseModel from '../../core/BaseModel.js';
import FirebaseDatabase from '../services/FirebaseDatabase.js';
import GetCollectionModelMap from './GetCollectionModelMap.js';

const PurchaseOrdersModel = {
    collection: 'PurchaseOrders',
    schema: {
        orderDate: {
            type: "date",
            default: new Date(),
            constraints: {
                required: true
            }
        },
        supplierKey: {
            type: "string",
            entity: "Suppliers",
            constraints: {
                required: true
            }
        },
        status: {
            type: "string",
            default: "Pendiente",
            constraints: {
                required: true,
                enum: ["Pendiente", "Aprobada", "Cancelada"]
            }
        },
        products: {
            type: "array",
            default: [],
            constraints: {
                required: true,
                minItems: 1
            },
            item: {
                productKey: {
                    type: "string",
                    default: null,
                    entity: "Products",
                    constraints: {
                        required: true
                    }
                },
                quantity: {
                    type: "number",
                    default: 0,
                    constraints: {
                        required: true,
                        min: 1
                    }
                }
            }
        },
        totalAmount: {
            type: "number",
            default: 0,
            constraints: {
                required: true
            }
        }
    },

    async findById(id) {
        let data = await FirebaseDatabase.findById(id);
        if (data) {
            data = await BaseModel.transformDataAfterFetch(data, PurchaseOrdersModel.schema, GetCollectionModelMap());
        }
        return data;
    },

    async findAll() {
        let data = await FirebaseDatabase.findAll(PurchaseOrdersModel.collection);
        if (data) {
            data = await Promise.all(
                data.map(item => BaseModel.transformDataAfterFetch(item, PurchaseOrdersModel.schema, GetCollectionModelMap()))
            );
        }
        return data;
    },

    async save(id, data) {
        BaseModel.validateData(data, PurchaseOrdersModel.schema);
        const transformedData = BaseModel.transformDataBeforeSave(data, PurchaseOrdersModel.schema);
        return await FirebaseDatabase.save(PurchaseOrdersModel.collection, id, transformedData);
    },

    async delete(id) {
        return await FirebaseDatabase.delete(id);
    },

    validateForm(data) {
        try {
            BaseModel.validateData(data, PurchaseOrdersModel.schema);
            return null; 
        } catch (errors) {
            return errors; 
        }
    },

    async createDefaultInstance(){
        return BaseModel.createDefaultInstance(PurchaseOrdersModel.schema);
    }
};

export default PurchaseOrdersModel;
