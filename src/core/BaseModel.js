import Logger from "../app/utils/Logger.js";

const LOG_ENABLED = false;

const BaseModel = {
    // Validación de datos según las restricciones
    async validateData(data, schema) {
        if (LOG_ENABLED) Logger.info('[BaseModel] Iniciando la validación de datos.');
        const errors = {};

        for (const key in schema) {
            const property = schema[key];
            const value = data[key];

            if (property.constraints?.required && (value === undefined || value === "" || value === null)) {
                errors[key] = `${key} es obligatorio.`;
                if (LOG_ENABLED) Logger.warn(`[BaseModel] Error de validación: ${key} es obligatorio.`);
                continue;
            }

            if (property.type) {
                if (property.type === "number" && typeof value !== "number") {
                    errors[key] = `${key} debe ser un número.`;
                    if (LOG_ENABLED) Logger.warn(`[BaseModel] Error de validación: ${key} debe ser un número.`);
                } else if (property.type === "string" && typeof value !== "string") {
                    errors[key] = `${key} debe ser una cadena de texto.`;
                    if (LOG_ENABLED) Logger.warn(`[BaseModel] Error de validación: ${key} debe ser una cadena de texto.`);
                } else if (property.type === "date" && !(value instanceof Date)) {
                    errors[key] = `${key} debe ser una fecha.`;
                    if (LOG_ENABLED) Logger.warn(`[BaseModel] Error de validación: ${key} debe ser una fecha.`);
                } else if (property.type === "array" && !Array.isArray(value)) {
                    errors[key] = `${key} debe ser un arreglo.`;
                    if (LOG_ENABLED) Logger.warn(`[BaseModel] Error de validación: ${key} debe ser un arreglo.`);
                }
            }

            if (property.constraints?.unique && value) {
                // Implementar validación de unicidad si es necesario
                if (LOG_ENABLED) Logger.debug(`[BaseModel] Validación de unicidad para ${key}.`);
            }

            if (property.constraints?.pattern && value) {
                const regex = new RegExp(property.constraints.pattern);
                if (!regex.test(value)) {
                    errors[key] = property.constraints.errorMessage || `${key} no cumple con el formato esperado.`;
                    if (LOG_ENABLED) Logger.warn(`[BaseModel] Error de validación: ${key} no cumple con el formato esperado.`);
                }
            }

            // Validación de enum (soportando funciones asíncronas)
            if (property.constraints?.enum) {
                let enumValues;

                // Verifica si es una función (asíncrona)
                if (typeof property.constraints.enum === 'function') {
                    try {
                        enumValues = await property.constraints.enum();
                    } catch (error) {
                        Logger.warn(`[BaseModel] Error al obtener los valores de enum para ${key}: ${error}`);
                        continue;
                    }
                } else {
                    enumValues = property.constraints.enum;
                }

                // Realiza la validación del enum
                if (!enumValues.includes(value)) {
                    errors[key] = `${key} debe ser uno de los siguientes valores: ${enumValues.join(", ")}.`;
                    Logger.warn(`[BaseModel] Error de validación: ${key} debe ser uno de los siguientes valores: ${enumValues.join(", ")}.`);
                }
            }
        }

        if (Object.keys(errors).length > 0) {
            if (LOG_ENABLED) Logger.error('[BaseModel] Validación fallida con errores.', errors);
            throw errors;
        }

        if (LOG_ENABLED) Logger.info('[BaseModel] Validación completada sin errores.');
    },

    // Transformación de datos antes de guardar
    transformDataBeforeSave(data, schema) {
        if (LOG_ENABLED) Logger.info('[BaseModel] Transformando datos antes de guardar.');
        const transformedData = { ...data };

        for (const key in schema) {
            const property = schema[key];
            let value = transformedData[key];

            if (value === undefined) {
                if (property.default !== undefined) {
                    transformedData[key] = property.default;
                    if (LOG_ENABLED) Logger.debug(`[BaseModel] Asignando valor por defecto a ${key}.`);
                } else {
                    delete transformedData[key];
                    if (LOG_ENABLED) Logger.debug(`[BaseModel] Eliminando propiedad ${key} porque no tiene valor asignado.`);
                }
            }

            if (property.type === 'date' && value instanceof Date) {
                transformedData[key] = value.toISOString();
                if (LOG_ENABLED) Logger.debug(`[BaseModel] Transformando fecha ${key} a ISOString.`);
            }

            if (property.type === 'number') {
                transformedData[key] = parseFloat(parseFloat(value).toFixed(2));
                if (LOG_ENABLED) Logger.debug(`[BaseModel] Redondeando número ${key} a dos decimales.`);
            }

            if (typeof value === 'string') {
                transformedData[key] = value.trim();
                if (LOG_ENABLED) Logger.debug(`[BaseModel] Eliminando espacios en blanco de ${key}.`);
            }

            if (property.autoIncrement) {
                // Implementar lógica de autoincremento si es necesario
                if (LOG_ENABLED) Logger.debug(`[BaseModel] Aplicando autoincremento a ${key}.`);
            }
        }

        if (LOG_ENABLED) Logger.info('[BaseModel] Transformación de datos antes de guardar completada.');
        return transformedData;
    },

    async transformDataAfterFetch(data, schema, colletionModelMap) {
        if (LOG_ENABLED) Logger.info('[BaseModel] Transformando datos después de la recuperación.');
        const transformedData = { ...data };

        for (const key in schema) {
            const property = schema[key];
            let value = transformedData[key];

            // Transformación de fechas
            if (property.type === 'date' && typeof value === 'string') {
                transformedData[key] = new Date(value);
                if (LOG_ENABLED) Logger.debug(`[BaseModel] Transformando cadena ${key} a objeto Date.`);
            }

            // Asignar valor por defecto si es necesario
            if (value === undefined && property.default !== undefined) {
                transformedData[key] = property.default;
                if (LOG_ENABLED) Logger.debug(`[BaseModel] Asignando valor por defecto a ${key}.`);
            }

            // Resolución de referencias simples (propiedades que terminan en Key)
            if (key.endsWith('Key') && typeof value === 'string' && property.entity) {
                const model = colletionModelMap[property.entity];
                if (model) {
                    const referencedData = await model.findById(value);
                    transformedData[key.replace('Key', '')] = await this.transformDataAfterFetch(referencedData, model.schema, colletionModelMap);
                    if (LOG_ENABLED) Logger.debug(`[BaseModel] Resuelta la referencia ${key} a ${key.replace('Key', '')}.`);
                }
            }

            // Manejo de arrays
            if (property.type === 'array' && Array.isArray(value)) {
                if (property.entity) {
                    // El array contiene directamente keys como strings
                    const model = colletionModelMap[property.entity];
                    if (model) {
                        for (let i = 0; i < value.length; i++) {
                            const referencedData = await model.findById(value[i]);
                            value[i] = await this.transformDataAfterFetch(referencedData, model.schema, colletionModelMap);
                            if (LOG_ENABLED) Logger.debug(`[BaseModel] Resuelta la referencia de array en ${key}[${i}].`);
                        }
                    }
                }
            }
        }

        if (LOG_ENABLED) Logger.info('[BaseModel] Transformación de datos después de la recuperación completada.');
        return transformedData;
    },

    createDefaultInstance(schema) {
        if (LOG_ENABLED) Logger.info('[BaseModel] Creando instancia por defecto.');
        const defaultInstance = {};

        for (const key in schema) {
            if (schema.hasOwnProperty(key)) {
                const property = schema[key];
                defaultInstance[key] = property.hasOwnProperty('default') ? property.default : null;
                if (LOG_ENABLED) Logger.debug(`[BaseModel] Propiedad ${key} inicializada con valor: ${defaultInstance[key]}`);
            }
        }

        if (LOG_ENABLED) Logger.info('[BaseModel] Instancia por defecto creada con éxito.');
        return defaultInstance;
    }
};

export default BaseModel;
