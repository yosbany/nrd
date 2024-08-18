import DataModel from '../config/DataModel.js';

const ValidationModel = {
    validateEntityData: (item, entityName) => {
        const errors = {};
        const entitySchema = DataModel[entityName];

        if (!entitySchema) {
            throw new Error(`El esquema para la entidad '${entityName}' no está definido.`);
        }

        Object.keys(entitySchema).forEach(key => {
            const property = entitySchema[key];
            let value = item[key];

            // Validación de campos requeridos
            if (property.constraints?.required && (value === undefined || value === "" || value === null)) {
                errors[key] = `${key} es obligatorio.`;
                return;
            }

            // Si el campo no es requerido y el valor es undefined, null o vacío, no realizar más validaciones
            if (!property.constraints?.required && (value === undefined || value === "" || value === null)) {
                return;
            }

            // Validación de tipos
            if (property.type) {
                if (property.type === "number" && typeof value !== "number") {
                    errors[key] = `${key} debe ser un número.`;
                } else if (property.type === "string" && typeof value !== "string") {
                    errors[key] = `${key} debe ser una cadena de texto.`;
                } else if (property.type === "date" && !(value instanceof Date)) {
                    errors[key] = `${key} debe ser una fecha.`;
                }
            }

            // Manejar referencias a otras entidades
            if (property.entity && key.endsWith('Key')) {
                if (typeof value !== "string") {
                    errors[key] = `${key} debe ser una referencia válida.`;
                } 
            }

            // Validación de patrones
            if (property.constraints?.pattern && value) {
                const regex = new RegExp(property.constraints.pattern);
                if (!regex.test(value)) {
                    errors[key] = property.constraints.errorMessage || `${key} no cumple con el formato esperado.`;
                }
            }

            // Validación de valores únicos
            if (property.constraints?.unique) {
                // Aquí puedes agregar lógica para verificar si el valor es único
                // Ejemplo: comprobar si el valor ya existe en la base de datos
            }

            // Validación de enumeraciones (enum)
            if (property.constraints?.enum && !property.constraints.enum.includes(value)) {
                errors[key] = `${key} debe ser uno de los siguientes valores: ${property.constraints.enum.join(", ")}.`;
            }
        });

        return errors;
    },

    validateEntitiesSchema: () => {
        const errors = [];

        // Validar que la entidad 'Users' esté presente
        if (!DataModel.Users) {
            errors.push("La entidad 'Users' es obligatoria y no está definida en el esquema.");
        }

        Object.keys(DataModel).forEach(entityName => {
            const entityProperties = DataModel[entityName] || {};

            // Validar existencia de propiedades básicas en cada entidad
            if (!entityProperties) {
                errors.push(`La entidad '${entityName}' no tiene propiedades definidas.`);
                return;
            }

            Object.keys(entityProperties).forEach(propertyName => {
                const property = entityProperties[propertyName];

                // Validar que todas las propiedades tengan un tipo
                if (!property.type) {
                    errors.push(`La propiedad '${propertyName}' en la entidad '${entityName}' no tiene un tipo definido.`);
                }

                // Validar la existencia y tipo de constraints
                if (property.constraints) {
                    if (typeof property.constraints !== 'object') {
                        errors.push(`Las constraints de la propiedad '${propertyName}' en la entidad '${entityName}' deben ser un objeto.`);
                    } else {
                        if (property.constraints.minLength && typeof property.constraints.minLength !== 'number') {
                            errors.push(`La constraint minLength en '${propertyName}' debe ser un número.`);
                        }
                        if (property.constraints.maxLength && typeof property.constraints.maxLength !== 'number') {
                            errors.push(`La constraint maxLength en '${propertyName}' debe ser un número.`);
                        }
                        if (property.constraints.unique && typeof property.constraints.unique !== 'boolean') {
                            errors.push(`La constraint unique en '${propertyName}' debe ser un booleano.`);
                        }
                    }
                }

                // Validación de relaciones (entity)
                if (property.entity && propertyName.endsWith('Key')) {
                    if (typeof property.entity !== 'string') {
                        errors.push(`La relación de la propiedad '${propertyName}' en la entidad '${entityName}' está mal definida.`);
                    } else {
                        // Validar que la entidad relacionada exista
                        if (!DataModel[property.entity]) {
                            errors.push(`La entidad referenciada '${property.entity}' en la relación de '${propertyName}' en '${entityName}' no existe.`);
                        }
                    }
                }

                // Validar enumeraciones (enum)
                if (property.constraints?.enum && !Array.isArray(property.constraints.enum)) {
                    errors.push(`La propiedad 'enum' en '${propertyName}' de la entidad '${entityName}' debe ser un arreglo.`);
                }
            });
        });

        return errors;
    },
};

export default ValidationModel;
