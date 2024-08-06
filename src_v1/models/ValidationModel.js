
const ValidationModel = {
    validateEntityData: (item, entitySchema) => {
        const errors = {};

        Object.keys(entitySchema).forEach(key => {
            const property = entitySchema[key];
            let value = item[key];

            // Manejar referencias a otras entidades (Ref)
            if (property.type === 'Ref' && typeof value === 'object' && value !== null) {
                if (value.id) {
                    value = `${property.referenceEntity || ''}/${value.id}`;
                    item[key] = value; // Actualizar el valor en el item
                } else {
                    errors[key] = `${property.label} no contiene una referencia válida.`;
                }
            }

            // Validación de campos requeridos
            if (property.required && (!value || (property.inputType === "select" && value === ""))) {
                errors[key] = `${property.label} es obligatorio`;
            }

            // Validación de patrones
            if (property.pattern && value) {
                const regex = new RegExp(property.pattern);
                if (!regex.test(value)) {
                    errors[key] = `${property.label} no cumple con el formato esperado`;
                }
            }
        });

        return errors;
    },

    validateEntitiesSchema: entitySchema => {
        const errors = [];
    
        // Verificar que la entidad 'users' exista
        if (!entitySchema.users) {
            errors.push("El esquema de entidad debe contener una entidad llamada 'users'.");
        } else {
            // Verificar que 'users' tenga las propiedades requeridas
            const userSchema = entitySchema.users.properties || {};
            if (!userSchema.fullName) {
                errors.push("La entidad 'users' debe tener una propiedad 'fullName'.");
            }
            if (!userSchema.email) {
                errors.push("La entidad 'users' debe tener una propiedad 'email'.");
            }
            if (!userSchema.role) {
                errors.push("La entidad 'users' debe tener una propiedad 'role'.");
            }
        }
    
        // Validar las demás entidades y sus propiedades
        Object.keys(entitySchema).forEach(entityName => {
            const entityProperties = entitySchema[entityName].properties || {};
    
            Object.keys(entityProperties).forEach(propertyName => {
                const property = entityProperties[propertyName];
    
                // Validar que todas las propiedades tengan un label
                if (!property.label) {
                    errors.push(`La propiedad '${propertyName}' en la entidad '${entityName}' no tiene un label definido.`);
                }

                // Validar que todas las propiedades tengan un type
                if (!property.type) {
                    errors.push(`La propiedad '${propertyName}' en la entidad '${entityName}' no tiene un type definido.`);
                }

                // Validar que todas las propiedades tengan un inputType
                if (!property.inputType) {
                    errors.push(`La propiedad '${propertyName}' en la entidad '${entityName}' no tiene un inputType definido.`);
                }
    
    
                // Validar propiedades de tipo Ref con la convención de nombre correcta
                if (propertyName.includes('Ref')) {
                    const [baseName, refEntityName] = propertyName.split('Ref');
                    if (!baseName || !refEntityName) {
                        errors.push(`La propiedad '${propertyName}' en la entidad '${entityName}' tiene un nombre de referencia no válido.`);
                    } else {
                        const expectedEntityName = refEntityName.charAt(0).toLowerCase() + refEntityName.slice(1);
                        if (!entitySchema[expectedEntityName]) {
                            errors.push(`La propiedad '${propertyName}' de la entidad '${entityName}' es un referencia a '${expectedEntityName}' y este no existe en el esquema de entidades.`);
                        }
                        else if(!property.labelRef){
                            errors.push(`La propiedad '${propertyName}' en la entidad '${entityName}' no tiene un labelRef definido, para una entidad de referencia.`);
                        }
                    }
                }
            });
        });
    
        return errors;
    }
};

export default ValidationModel;
