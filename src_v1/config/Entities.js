const Entities = {
    users: {
        label: "Usuarios",
        properties: {
            name: { type: "string", label: "Nombre", showInTable: true, showInForm: true, inputType: "text", default: "", required: true },
            email: { type: "string", label: "Correo Electrónico", showInTable: true, showInForm: true, inputType: "text", default: "" },
            role: { type: "string", label: "Rol", showInTable: true, showInForm: true, inputType: "select", options: ["admin", "user"], default: "user" }
        }
    },
    products: {
        label: "Productos",
        properties: {
            name: { type: "string", label: "Nombre", showInTable: true, showInForm: true, inputType: "text", default: "" },
            price: { type: "number", label: "Precio", showInTable: true, showInForm: true, inputType: "number", default: 0 },
            stock: { type: "number", label: "Stock", showInTable: true, showInForm: true, inputType: "number", default: 0 }
        }
    },
    orders: {
        label: "Pedidos",
        properties: {
            userId: { 
                label: "Usuario", 
                inputType: "select", 
                type: "string", 
                showInForm: true, 
                showInTable: true,
                options: [],
                linkTo: "users",
                optionLabel: "name"
            },
            quantity: { type: "number", label: "Cantidad", showInTable: true, showInForm: true, inputType: "number", default: 1 },
            status: { type: "string", label: "Estado", showInTable: false, showInForm: true, inputType: "select", options: ["pending", "completed"], default: "pending" },
            products: {
                label: "Productos",
                inputType: "link",
                type: "array",
                showInForm: true,
                showInTable: false,
                linkTo: "products",
                default: []
            }
        }
    }
};

export default Entities;
