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
      price: { 
          type: "number", 
          default: 0, 
          constraints: { 
              required: true 
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
          default: null,
          entity: "Suppliers"
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
          default: new Date()
      },
      supplierKey: {
          type: "string",
          default: null,
          entity: "Suppliers"
      }
  },
  PurchaseOrders: {
      code: {
          type: "string",
          default: "",
          constraints: {
              required: true,
              unique: true
          }
      },
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
      products: {
          type: "array",
          default: [],
          constraints: {
              required: true
          },
          itemSchema: {
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
      }
  }
};

export default DataModel;
