import CodiguerasModel from '../models/CodiguerasModel.js';
import ProductsModel from '../models/ProductsModel.js';
import SuppliersModel from '../models/SuppliersModel.js';
import { decodeId } from '../utils/Helpers.js';
import Logger from '../utils/Logger.js';

const ProductFormController = {
    async oninit(vnode) {
        vnode.state.item = {};
        vnode.state.errors = {};
        vnode.state.id = decodeId(vnode.attrs.id);
        vnode.state.stats = {};

        if (vnode.attrs.id) {
            vnode.state.item = await ProductsModel.findById(vnode.state.id);
            Logger.warn("[Audit][ProductFormController] Loading data findById:", vnode.state.item);
            m.redraw();
        }
        else{
            vnode.state.item = await ProductsModel.createDefaultInstance();
            Logger.warn("[Audit][ProductFormController] Loading data createDefaultInstance:", vnode.state.item);
            m.redraw();
        }

        // Realiza la validación del nombre al levantar el formulario
        if (vnode.state.item.name) {
            const resultName = await ProductFormController.validateProductName(vnode.state.item.name);
            vnode.state.isNameValid = resultName.valid;
            if (!resultName.valid) {
                vnode.state.errors.name = resultName.message;
            }
        }
        if (vnode.state.item.salesName) {
            const resultSalesName = await ProductFormController.validateProductName(vnode.state.item.salesName);
            vnode.state.isSalesNameValid = resultSalesName.valid;
            if (!resultSalesName.valid) {
                vnode.state.errors.salesName = resultSalesName.message;
            }
        }

        vnode.state.stats = await ProductFormController.getStatistics(vnode);
        m.redraw();
    },

    async handleSubmit(e, vnode) {
        e.preventDefault();
    
        const errors = ProductsModel.validateForm(vnode.state.item);
        vnode.state.errors = errors || {};
    
        if (!errors) {
            try {
                await ProductsModel.save(vnode.state.id, vnode.state.item);
                m.route.set('/products');
            } catch (error) {
                vnode.state.errors = { save: error.message };
                m.redraw();
            }
        } else {
            m.redraw();
        }
    },

    async getSupplierOptions() {
        return await SuppliersModel.getOptionsKeyValue();
    },

    async getCodigerasOptions(parentValue) {
        return await CodiguerasModel.getParentOptionsKeyValue(parentValue);
    },

    async getStatistics(vnode) {
        const purchaseHistory = vnode.state.item.purchasePriceHistory || [];
        
        if (purchaseHistory.length === 0) {
            return {
                lastPrice: 0,
                lastSupplier: "",
                minPrice: 0,
                minPriceSupplier: "",
                unitCost: 0,
                salePrice20: 0,
                salePrice25: 0,
                salePrice30: 0
            };
        }
    
        const suppliers = await ProductFormController.getSupplierOptions();
    
        const lastPurchase = purchaseHistory[purchaseHistory.length - 1];
        const unitCost = lastPurchase.unitPrice / lastPurchase.packagingConversion;
    
        const minPricePurchase = purchaseHistory.reduce((min, current) => 
            current.unitPrice < min.unitPrice ? current : min, purchaseHistory[0]
        );
    
        const calculateSalePrice = (cost, margin) => Math.round(cost / (1 - margin));
    
        return {
            lastPrice: lastPurchase.unitPrice,
            lastSupplier: suppliers.find(s => s.id === lastPurchase.supplierKey)?.display || "",
            minPrice: minPricePurchase.unitPrice,
            minPriceSupplier: suppliers.find(s => s.id === minPricePurchase.supplierKey)?.display || "",
            unitCost: unitCost.toFixed(2),
            salePrice20: calculateSalePrice(unitCost, 0.20),
            salePrice25: calculateSalePrice(unitCost, 0.25),
            salePrice30: calculateSalePrice(unitCost, 0.30)
        };
    },

    async validateProductName(productName) {
        if(!productName){
            return { valid: false, message: 'Para validar es necesario ingresar un nombre.' };
        }
        const productTypes = await CodiguerasModel.getParentOptions("Tipos de Productos");
        const brands = await CodiguerasModel.getParentOptions("Marcas");
        const units = await CodiguerasModel.getParentOptions("Unidades de Medidas");
        
        const parts = productName.split(' ');
    
        // Verificar que al menos existan 4 elementos obligatorios (tipoProducto, características, contenido, unidad)
        if (parts.length < 4) {
            return { valid: false, message: 'El nombre del producto debe tener al menos 4 elementos: Tipo de producto, características clave, contenido y unidad.' };
        }
    
        // Identificar la unidad de medida (último elemento)
        const unit = parts.pop();
        if (!units.includes(unit)) {
            return { valid: false, message: 'La unidad de medida especificada no es válida.' };
        }
    
        // Identificar el contenido (penúltimo elemento)
        const content = parts.pop();
        if (content !== 'X' && isNaN(content)) {
            return { valid: false, message: 'El contenido debe ser un número o "X" para productos al peso.' };
        }
    
        // Ahora necesitamos determinar el tipo de producto, la marca (opcional) y las características
        let productType = '';
        let brand = null;
        let features = '';
    
        // Verificar si el tipo de producto coincide con uno del array
        for (let i = 2; i >= 0; i--) { // Buscar combinaciones de una o dos palabras para el tipo de producto
            const potentialProductType = parts.slice(0, i + 1).join(' ');
            if (productTypes.includes(potentialProductType)) {
                productType = potentialProductType;
                parts.splice(0, i + 1); // Remover el tipo de producto de las partes
                break;
            }
        }
    
        if (!productType) {
            return { valid: false, message: 'El tipo de producto especificado no es válido.' };
        }
    
        // Segunda hipótesis: identificar la marca si está presente
        if (parts.length > 0 && brands.includes(parts[0])) {
            brand = parts.shift(); // Si la primera palabra restante es una marca, la extraemos
            if (parts.length > 0 && brands.includes(`${brand} ${parts[0]}`)) {
                brand += ` ${parts.shift()}`; // Posibilidad de que la marca tenga dos palabras
            }
        }
    
        // Lo que quede son las características clave
        features = parts.join(' ');
    
        // Validar que las características clave no estén vacías
        if (features.trim().length === 0) {
            return { valid: false, message: 'Las características clave no pueden estar vacías.' };
        }
    
        // Validación exitosa
        return { 
            valid: true, 
            message: 'El nombre del producto es válido.', 
            data: {
                productType,
                brand,
                features,
                content,
                unit
            }
        };
    },
    
    
    async handleValidateNameButtonClick(vnode) {
        const result = await ProductFormController.validateProductName(vnode.state.item.name);
        vnode.state.isNameValid = result.valid;
        if (result.valid) {
            Logger.info("[Audit][ProductFormController] Validación exitosa:", vnode.state.item.name);
            vnode.state.errors.name = "";
            
        } else {
            vnode.state.errors.name = result.message;
        }

        m.redraw();
    },

    async handleValidateSalesNameButtonClick(vnode) {
        const result = await ProductFormController.validateProductName(vnode.state.item.salesName);
        vnode.state.isSalesNameValid = result.valid;
        if (result.valid) {
            Logger.info("[Audit][ProductFormController] Validación exitosa:", vnode.state.item.salesName);
            vnode.state.errors.name = "";
        } else {
            vnode.state.errors.salesName = result.message;
        }

        m.redraw();
    }
};

export default ProductFormController;
