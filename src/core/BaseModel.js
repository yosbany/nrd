import Logger from "../app/utils/Logger.js";

const BaseModel = {
    // Validación de datos según las restricciones
    async validateData(data, schema) {
        Logger.info('[BaseModel] Iniciando la validación de datos.');
        const errors = {};

        for (const key in schema) {
            const property = schema[key];
            const value = data[key];

            // Validación de campos requeridos
            if (property.constraints?.required && (value === undefined || value === "" || value === null)) {
                errors[key] = `${key} es obligatorio.`;
                Logger.warn(`[BaseModel] Error de validación: ${key} es obligatorio.`);
                continue;
            }

            // Validación de tipo
            if (property.type) {
                if (property.type === "number" && typeof value !== "number") {
                    errors[key] = `${key} debe ser un número.`;
                    Logger.warn(`[BaseModel] Error de validación: ${key} debe ser un número.`);
                } else if (property.type === "string" && typeof value !== "string") {
                    errors[key] = `${key} debe ser una cadena de texto.`;
                    Logger.warn(`[BaseModel] Error de validación: ${key} debe ser una cadena de texto.`);
                } else if (property.type === "date" && !(value instanceof Date)) {
                    errors[key] = `${key} debe ser una fecha.`;
                    Logger.warn(`[BaseModel] Error de validación: ${key} debe ser una fecha.`);
                } else if (property.type === "array" && !Array.isArray(value)) {
                    errors[key] = `${key} debe ser un arreglo.`;
                    Logger.warn(`[BaseModel] Error de validación: ${key} debe ser un arreglo.`);
                }
            }

            // Validación de unicidad (debes implementar la lógica específica)
            if (property.constraints?.unique && value) {
                // Implementar validación de unicidad
                Logger.debug(`[BaseModel] Validación de unicidad para ${key}.`);
            }

            // Validación de patrón (regex)
            if (property.constraints?.pattern && value) {
                const regex = new RegExp(property.constraints.pattern);
                if (!regex.test(value)) {
                    errors[key] = property.constraints.errorMessage || `${key} no cumple con el formato esperado.`;
                    Logger.warn(`[BaseModel] Error de validación: ${key} no cumple con el formato esperado.`);
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

        // Si hay errores, lanzamos una excepción con ellos
        if (Object.keys(errors).length > 0) {
            Logger.error('[BaseModel] Validación fallida con errores.', errors);
            throw errors;
        }

        Logger.info('[BaseModel] Validación completada sin errores.');
    },

    // Transformación de datos antes de guardar
    transformDataBeforeSave(data, schema) {
        Logger.info('[BaseModel] Transformando datos antes de guardar.');
        const transformedData = { ...data };

        for (const key in schema) {
            const property = schema[key];
            let value = transformedData[key];

            // Asignar valor por defecto o eliminar propiedades no definidas
            if (value === undefined) {
                if (property.default !== undefined) {
                    transformedData[key] = property.default;
                    Logger.debug(`[BaseModel] Asignando valor por defecto a ${key}.`);
                } else {
                    delete transformedData[key];
                    Logger.debug(`[BaseModel] Eliminando propiedad ${key} porque no tiene valor asignado.`);
                }
            }

            // Transformar fechas a ISOString
            if (property.type === 'date' && value instanceof Date) {
                transformedData[key] = value.toISOString();
                Logger.debug(`[BaseModel] Transformando fecha ${key} a ISOString.`);
            }

            // Redondear números a dos decimales
            if (property.type === 'number') {
                transformedData[key] = parseFloat(parseFloat(value).toFixed(2));
                Logger.debug(`[BaseModel] Redondeando número ${key} a dos decimales.`);
            }

            // Eliminar espacios en blanco en cadenas de texto
            if (typeof value === 'string') {
                transformedData[key] = value.trim();
                Logger.debug(`[BaseModel] Eliminando espacios en blanco de ${key}.`);
            }

            // Aplicar autoincremento (si es necesario)
            if (property.autoIncrement) {
                // Implementar lógica de autoincremento
                Logger.debug(`[BaseModel] Aplicando autoincremento a ${key}.`);
            }
        }

        Logger.info('[BaseModel] Transformación de datos antes de guardar completada.');
        return transformedData;
    }
};

export default BaseModel;
