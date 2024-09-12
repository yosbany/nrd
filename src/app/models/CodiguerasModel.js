import BaseModel from '../../core/BaseModel.js';
import FirebaseDatabase from '../services/FirebaseDatabase.js';
import GetCollectionModelMap from './GetCollectionModelMap.js';


const CodiguerasModel = {
    collection: 'Codebreakers',
    schema: {
        name: { 
            type: "string", 
            default: "", 
            constraints: { 
                required: true, 
                maxLength: 100 
            }
        },
        parent: { 
            type: "string", 
            default: ""
        }
    },

    async findById(id) {
        let data = await FirebaseDatabase.findById(id);
        if (data) {
            data = await BaseModel.transformDataAfterFetch(data, CodiguerasModel.schema, GetCollectionModelMap());
        }
        return data;
    },

    async findAll() {
        let data = await FirebaseDatabase.findAll(this.collection);
        if (data) {
            data = await Promise.all(
                data.map(item => BaseModel.transformDataAfterFetch(item, CodiguerasModel.schema, GetCollectionModelMap()))
            );
        }
        return data;
    },

    async save(id, data) {
        BaseModel.validateData(data, CodiguerasModel.schema);
        const transformedData = BaseModel.transformDataBeforeSave(data, CodiguerasModel.schema);
        return await FirebaseDatabase.save(CodiguerasModel.collection, id, transformedData);
    },

    async delete(id) {
        return await FirebaseDatabase.delete(id);
    },

    validateForm(data) {
        try {
            BaseModel.validateData(data, CodiguerasModel.schema);
            return null; 
        } catch (errors) {
            return errors; 
        }
    },

    async createDefaultInstance(){
        return BaseModel.createDefaultInstance(CodiguerasModel.schema);
    },

    async findByParent(parent) {
        let data = await FirebaseDatabase.findAll(CodiguerasModel.collection);
        if (data) {
            // Filtrar las codigueras que tienen el mismo parentId
            data = data.filter(item => item.parent === parent);
            data = await Promise.all(
                data.map(item => BaseModel.transformDataAfterFetch(item, CodiguerasModel.schema, GetCollectionModelMap()))
            );
        }
        return data;
    },

    async getParentOptions(parent) {
        const codigeras = await CodiguerasModel.findByParent(parent);
        return codigeras.map(codigera => codigera.name);
    },

    async getParentOptionsKeyValue(parent) {
        const codigeras = await CodiguerasModel.findByParent(parent);
        return codigeras.map(codigera => ({ id: codigera.name, display: codigera.name }));
    },
};

export default CodiguerasModel;
