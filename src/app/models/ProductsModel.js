import BaseModel from '../../core/BaseModel.js';
import FirebaseDatabase from '../services/FirebaseDatabase.js';
import Logger from '../utils/Logger.js';
import GetCollectionModelMap from './GetCollectionModelMap.js';

const ProductsModel = {
    collection: 'Products',
    schema: {
        sku: { 
            type: "string", 
            default: "", 
            constraints: { 
                required: true, 
                unique: true 
            }
        },
        name: { 
            type: "string", 
            default: "", 
            constraints: { 
                required: true, 
                maxLength: 255 
            }
        },
        salesName: { 
            type: "string", 
            default: "", 
            constraints: { 
                maxLength: 255 
            }
        },
        image: { 
            type: "string", 
            default: ""
        },
        desiredStock: { 
            type: "number", 
            default: 0
        },
        preferredSupplierKey: {
            type: "string",
            entity: "Suppliers"
        },
        purchasePriceHistory: {
            type: "array",
            default: [],
            item: {
                purchasePriceId: {
                    type: "string",
                    default: null,
                    entity: "PurchasePrices",
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
                        enum: ["UN", "KG", "FUNDA", "PLANCHA", "CAJON", "BOLSA", "ATADO"]
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
            }
        },
        sector: {
            type: "string",
            default: "General",
            constraints: {
                enum: ["Bakery", "Dairy", "Meat", "Produce", "Frozen", "Pantry", "Beverages", "General"]
            }
        },
        sectorOrder: {
            type: "number",
            default: 0
        },
        salesPackaging: {
            type: "string",
            default: "UN",
            constraints: {
                enum: ["UN", "KG", "FUNDA", "PLANCHA", "CAJON", "BOLSA", "ATADO"]
            }
        },
        unitSalesCost: {
            type: "number",
            default: 0
        }
    },

    async findById(id) {
        let data = await FirebaseDatabase.findById(id);
        if (data) {
            data = await BaseModel.transformDataAfterFetch(data, ProductsModel.schema, GetCollectionModelMap());
        }
        return data;
    },

    async findAll() {
        let data = await FirebaseDatabase.findAll(ProductsModel.collection);
        if (data) {
            data = await Promise.all(
                data.map(item => BaseModel.transformDataAfterFetch(item, ProductsModel.schema, GetCollectionModelMap()))
            );
        }
        return data;
    },

    async save(id, data) {
        BaseModel.validateData(data, ProductsModel.schema);
        const transformedData = BaseModel.transformDataBeforeSave(data, ProductsModel.schema);
        return await FirebaseDatabase.save(ProductsModel.collection, id, transformedData);
    },

    async delete(id) {
        return await FirebaseDatabase.delete(id);
    },

    async getOptionsKeyValue() {
        const products = await ProductsModel.findAll();
        return products.map(product => ({ id: product.id, display: product.name }));
    },

    validateForm(data) {
        try {
            BaseModel.validateData(data, ProductsModel.schema);
            return null; 
        } catch (errors) {
            return errors; 
        }
    },

    async createDefaultInstance(){
        return BaseModel.createDefaultInstance(ProductsModel.schema);
    },

    async updatePurchasePriceHistory(productId, purchasePriceData) {
        try {
            const product = await ProductsModel.findById(productId);
            if (product) {
                // Añadir el nuevo precio de compra al historial
                product.purchasePriceHistory.push(purchasePriceData);
                
                // Guardar los cambios
                await ProductsModel.save(productId, product);
                Logger.info(`[Audit][ProductsModel] Purchase price history updated for product ${productId}`);
            }
            
        } catch (error) {
            Logger.error(`[Audit][ProductsModel] Error updating purchase price history for product ${productId}:`, error);
        }
    }

};

export default ProductsModel;
