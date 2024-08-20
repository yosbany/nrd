const DataModel = {
  Users: {
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
    role: { 
      type: "string", 
      default: "User", 
      constraints: { 
        required: true, 
        enum: ["Admin", "User"]
      }
    }
  },
  Products: {
    sku: { 
      type: "string", 
      default: "", 
      constraints: { 
        required: true, 
        unique: true 
      }
    },
    name: { 
      type: "string", 
      default: "", 
      constraints: { 
        required: true, 
        maxLength: 255 
      }
    },
    image: { 
      type: "string", 
      default: ""
    },
    desiredStock: { 
      type: "number", 
      default: 0
    },
    minimumStock: { 
      type: "number", 
      default: 0
    },
    preferredSupplierKey: {
      type: "string",
      entity: "Suppliers"
    },
    lastPurchasePrice: {
      type: "number",
      default: 0,
      constraints: {
        required: false
      }
    }
  },
  Suppliers: {
    tradeName: { 
      type: "string", 
      default: "", 
      constraints: { 
        required: true 
      }
    },
    businessName: { 
      type: "string", 
      default: ""
    },
    rut: { 
      type: "string", 
      default: ""
    },
    phone: {
      type: "string",
      default: "",
      constraints: {
        pattern: /^\+598[0-9]{8}$/,
      }
    }
  },
  PurchasePrices: {
    productKey: {
      type: "string",
      default: null,
      entity: "Products"
    },
    unitPrice: {
      type: "number",
      default: 0
    },
    date: {
      type: "date",
      default: new Date(),
      constraints: {
        required: true
      }
    },
    supplierKey: {
      type: "string",
      default: null,
      entity: "Suppliers"
    },
    purchasePackaging: {
      type: "string",
      default: "UN",
      constraints: {
        required: true,
        enum: ["UN", "KG", "FUNDA", "PLANCHA", "CAJON", "BOLSA", "ATADO"]
      }
    },
    supplierProductCode: {
      type: "string",
      default: "",
      constraints: {
        required: false
      }
    }
  },
  PurchaseOrders: {
    orderDate: {
      type: "date",
      default: new Date(),
      constraints: {
        required: true
      }
    },
    supplierKey: {
      type: "string",
      default: null,
      entity: "Suppliers",
      constraints: {
        required: true
      }
    },
    status: {
      type: "string",
      default: "Pendiente",
      constraints: {
        required: true,
        enum: ["Pendiente", "Aprobada", "Cancelada"]
      }
    },
    products: {
      type: "array",
      default: [],
      constraints: {
        required: true,
        minItems: 1
      },
      item: {
        productKey: {
          type: "string",
          default: null,
          entity: "Products",
          constraints: {
            required: true
          }
        },
        quantity: {
          type: "number",
          default: 0,
          constraints: {
            required: true,
            min: 1
          }
        }
      }
    },
    totalAmount: {
      type: "number",
      default: 0,
      constraints: {
        required: true
      }
    }
  }
};

export default DataModel;
