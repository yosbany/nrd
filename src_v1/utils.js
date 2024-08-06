import TextInput from './components/base/TextInput.js';
import NumberInput from './components/base/NumberInput.js';
import SelectInput from './components/base/SelectInput.js';
import CheckboxInput from './components/base/CheckboxInput.js';
import RadioInput from './components/base/RadioInput.js';
import FileInput from './components/base/FileInput.js';
import PasswordInput from './components/base/PasswordInput.js';
import DateInput from './components/base/DateInput.js';
import TextareaInput from './components/base/TextareaInput.js';
import LinkOutput from './components/base/LinkOutput.js';


export const getComponentEntityProperty = (propertySchema, value, onInput, error) => {
    let propsConfigEntity = {
        label: propertySchema.label,
        required: propertySchema.required,
        documentation: propertySchema.documentation,
        value: value ? value : propertySchema.default,
        outputMode: false,
        showLabel: true,
        onInput,
        error // Añadir el error al objeto de configuración
    };

    if (propertySchema.options) {
        propsConfigEntity = { ...propsConfigEntity, options: propertySchema.options };
    }

    switch (propertySchema.inputType) {
        case 'text':
            return m(TextInput, propsConfigEntity);
        case 'number':
            return m(NumberInput, propsConfigEntity);
        case 'select':
            return m(SelectInput, propsConfigEntity);
        case 'checkbox':
            return m(CheckboxInput, propsConfigEntity);
        case 'date':
            return m(DateInput, propsConfigEntity);
        case 'file':
            return m(FileInput, propsConfigEntity);
        case 'link':
            return m(LinkOutput, propsConfigEntity);
        case 'password':
            return m(PasswordInput, propsConfigEntity);
        case 'radio':
            return m(RadioInput, propsConfigEntity);
        case 'textarea':
            return m(TextareaInput, propsConfigEntity);
        default:
            return m("span", `Unsupported input type: ${propertySchema.inputType}`);
    }
};