import FirebaseModel from './models/FirebaseModel.js';

export const loadDynamicOptions = async (entity, entitySchema) => {
    const promises = Object.keys(entitySchema).map(key => {
        const property = entitySchema[key];
        if (property.inputType === 'select' && property.linkTo) {
            return FirebaseModel.getAll(property.linkTo).then(data => {
                const options = [];
                data.forEach(item => {
                    options.push({ value: item.id, label: item[property.optionLabel] });
                });
                return { key, options };
            });
        }
        return Promise.resolve(null);
    });

    return Promise.all(promises).then(results => {
        const dynamicOptions = {};
        results.forEach(result => {
            if (result) {
                dynamicOptions[result.key] = result.options;
            }
        });
        return dynamicOptions;
    });
};
