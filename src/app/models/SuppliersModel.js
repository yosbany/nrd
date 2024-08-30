import BaseModel from '../../core/BaseModel.js';
import FirebaseDatabase from '../services/FirebaseDatabase.js';
import GetCollectionModelMap from './GetCollectionModelMap.js';


const SuppliersModel = {
    collection: 'Suppliers',
    schema: {
        tradeName: { 
            type: "string", 
            default: "", 
            constraints: { 
                required: true 
            }
        },
        businessName: { 
            type: "string", 
            default: ""
        },
        rut: { 
            type: "string", 
            default: ""
        },
        phone: {
            type: "string",
            default: "",
            constraints: {
                pattern: /^\+598[0-9]{8}$/,
            }
        },
        contactFrequency: {
            type: "string",
            default: "Weekly",
            constraints: {
                required: false
            }
        },
        observation: {
            type: "string",
            default: "",
            constraints: {
                maxLength: 500
            }
        }
    },

    async findById(id) {
        let data = await FirebaseDatabase.findById(id);
        if (data) {
            data = await BaseModel.transformDataAfterFetch(data, this.schema, GetCollectionModelMap());
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
        const transformedData = BaseModel.transformDataBeforeSave(data, this.schema, GetCollectionModelMap());
        return await FirebaseDatabase.save(this.collection, id, transformedData);
    },

    async delete(id) {
        return await FirebaseDatabase.delete(id);
    },

    async getOptionsKeyValue() {
        const suppliers = await SuppliersModel.findAll();
        return suppliers.map(supplier => ({ id: supplier.id, display: supplier.tradeName }));
    },

    validateForm(data) {
        try {
            BaseModel.validateData(data, SuppliersModel.schema);
            return null; 
        } catch (errors) {
            return errors; 
        }
    },

    async createDefaultInstance(){
        return BaseModel.createDefaultInstance(SuppliersModel.schema);
    }

};

export default SuppliersModel;
