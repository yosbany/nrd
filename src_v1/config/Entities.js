const Entities = {
    users: {
      label: "Usuarios",
      category: "Datos",
      accessibleByRoles: ["Admin", "User"],
      showMenu: true,
      properties: {
        fullName: { 
          type: "string", 
          label: "Nombre Completo", 
          showInTable: true, 
          showInForm: true, 
          inputType: "text", 
          default: "", 
          required: true,
          documentation: "El nombre completo del usuario",
          pattern: "^[a-zA-Z\\s]+$",
          sortable: true
        },
        email: { 
          type: "string", 
          label: "Correo Electrónico", 
          showInTable: true, 
          showInForm: true, 
          inputType: "text", 
          default: "",
          required: true,
          documentation: "El correo electrónico del usuario",
          pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
          sortable: true
        },
        role: { 
          type: "string", 
          label: "Roles", 
          showInTable: true, 
          showInForm: true, 
          inputType: "select", 
          options: ["Admin", "User"], 
          default: ["User"],
          documentation: "Los roles del usuario en el sistema",
          sortable: true
        }
      }
    },
    products: {
      label: "Productos",
      category: "Datos",
      accessibleByRoles: ["Admin", "User"],
      showMenu: true,
      properties: {
        sku: { 
          type: "string", 
          label: "SKU", 
          showInTable: true, 
          showInForm: true, 
          inputType: "text", 
          default: "", 
          required: true,
          documentation: "El SKU del producto",
          sortable: true
        },
        name: { 
          type: "string", 
          label: "Nombre", 
          showInTable: true, 
          showInForm: true, 
          inputType: "text", 
          default: "", 
          required: true,
          documentation: "El nombre del producto",
          sortable: true
        },
        price: { 
          type: "number", 
          label: "Precio", 
          showInTable: true, 
          showInForm: true, 
          inputType: "number", 
          default: 0, 
          required: true,
          documentation: "El precio de venta del producto",
          sortable: true
        },
        image: { 
          type: "base64", 
          label: "Imagen", 
          showInTable: false, 
          showInForm: true, 
          inputType: "file", 
          default: "",
          documentation: "La imagen del producto"
        },
        desiredStock: { 
          type: "number", 
          label: "Stock Deseado", 
          showInTable: false, 
          showInForm: true, 
          inputType: "number", 
          default: 0, 
          documentation: "La cantidad de stock deseada del producto",
          sortable: true
        },
        minimumStock: { 
          type: "number", 
          label: "Stock Mínimo", 
          showInTable: false, 
          showInForm: true, 
          inputType: "number", 
          default: 0, 
          documentation: "La cantidad mínima de stock del producto",
          sortable: true
        },
        preferredSupplierRefSuppliers: {
          type: "string",
          label: "Proveedor Preferido",
          showInTable: false,
          showInForm: true,
          inputType: "select",
          labelRef: "tradeName - businessName",
          default: "",
          documentation: "El proveedor preferido del producto"
        },
        salesChannels: {
          type: "array",
          label: "Canales de Venta",
          showInTable: false,
          showInForm: true,
          inputType: "checkbox",
          options: ["Pedidos Ya", "Rappi", "Mostrador Casa Central", "Buen Provecho"],
          default: [],
          documentation: "Los canales de venta del producto"
        },
        purchasePricesRefPurchasePrices: {
          type: "array",
          label: "Precios de Compra",
          showInTable: false,
          showInForm: true,
          inputType: "link",
          labelRef: "unitPrice - date - supplier",
          default: [],
          documentation: "Lista de precios de compra del producto"
        }
      }
    },
    suppliers: {
      label: "Proveedores",
      category: "Datos",
      accessibleByRoles: ["Admin", "User"],
      showMenu: true,
      properties: {
        code: { 
          type: "string", 
          label: "Código", 
          showInTable: true, 
          showInForm: true, 
          inputType: "text", 
          default: "", 
          required: true,
          documentation: "El código del proveedor",
          sortable: true
        },
        tradeName: { 
          type: "string", 
          label: "Nombre Comercial", 
          showInTable: true, 
          showInForm: true, 
          inputType: "text", 
          default: "", 
          required: true,
          documentation: "El nombre comercial del proveedor",
          sortable: true
        },
        businessName: { 
          type: "string", 
          label: "Razón Social", 
          showInTable: false, 
          showInForm: true, 
          inputType: "text", 
          default: "", 
          required: false,
          documentation: "La razón social del proveedor",
          sortable: true
        },
        rut: { 
          type: "string", 
          label: "RUT", 
          showInTable: false, 
          showInForm: true, 
          inputType: "text", 
          default: "", 
          required: false,
          documentation: "El RUT del proveedor",
          sortable: true
        }
      }
    },
    purchasePrices: {
      label: "Precios de Compras",
      category: "Datos",
      accessibleByRoles: ["Admin", "User"],
      showMenu: true,
      properties: {
        productRefProducts: {
          type: "string",
          label: "Producto",
          showInTable: true,
          showInForm: true,
          inputType: "link",
          labelRef: "name",
          default: "",
          documentation: "El producto relacionado con el precio de compra"
        },
        unitPrice: {
          type: "number",
          label: "Precio Unitario",
          showInTable: true,
          showInForm: true,
          inputType: "number",
          default: 0,
          documentation: "El precio unitario de compra"
        },
        date: {
          type: "date",
          label: "Fecha",
          showInTable: true,
          showInForm: true,
          inputType: "date",
          default: new Date(),
          documentation: "La fecha del precio de compra"
        },
        supplierRefSuppliers: {
          type: "string",
          label: "Proveedor",
          showInTable: true,
          showInForm: true,
          inputType: "link",
          labelRef: "tradeName - businessName",
          default: "",
          documentation: "El proveedor del precio de compra"
        }
      }
    }
  };
  
  export default Entities;
  