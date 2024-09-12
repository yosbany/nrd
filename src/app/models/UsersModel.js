import BaseModel from '../../core/BaseModel.js';
import FirebaseDatabase from '../services/FirebaseDatabase.js';
import GetCollectionModelMap from './GetCollectionModelMap.js';


const UsersModel = {
    collection: 'Users',
    schema: {
        fullName: { 
            type: "string", 
            default: "", 
            constraints: { 
                required: true, 
                maxLength: 100 
            }
        },
        email: { 
            type: "string", 
            default: "", 
            constraints: { 
                required: true, 
                unique: true 
            }
        },
        roles: { 
            type: "array", 
            default: ["User"], 
            constraints: { 
                required: true, 
                enum: ["Admin", "User"]
            }
        }
    },

    async findById(id) {
        let data = await FirebaseDatabase.findById(id);
        if (data) {
            data = await BaseModel.transformDataAfterFetch(data, UsersModel.schema, GetCollectionModelMap());
        }
        return data;
    },

    async findAll() {
        let data = await FirebaseDatabase.findAll(UsersModel.collection);
        if (data) {
            data = await Promise.all(
                data.map(item => BaseModel.transformDataAfterFetch(item, UsersModel.schema, GetCollectionModelMap()))
            );
        }
        return data;
    },

    async save(id, data) {
        BaseModel.validateData(data, UsersModel.schema);
        const transformedData = BaseModel.transformDataBeforeSave(data, UsersModel.schema);
        return await FirebaseDatabase.save(UsersModel.collection, id, transformedData);
    },

    async delete(id) {
        return await FirebaseDatabase.delete(id);
    },

    async getUserRoles(id) {
        const user = await UsersModel.findById(id);
        if (user && user.roles) {
            return user.roles;  
        } else {
            return [];  
        }
    },

    validateForm(data) {
        try {
            BaseModel.validateData(data, UsersModel.schema);
            return null; 
        } catch (errors) {
            return errors; 
        }
    },

    async createDefaultInstance(){
        return BaseModel.createDefaultInstance(UsersModel.schema);
    }
};

export default UsersModel;
