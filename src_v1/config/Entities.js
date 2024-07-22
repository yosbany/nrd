/**
 * Características de una Entidad
 *
 * @typedef {Object} Entity
 * @property {string} label - Un nombre legible para humanos que describe la entidad.
 * @property {Object.<string, Property>} properties - Un objeto que define las propiedades de la entidad. Cada propiedad tiene varias subcaracterísticas que determinan su comportamiento y apariencia.
 */

/**
 * Propiedad de una Entidad
 *
 * @typedef {Object} Property
 * @property {string} type - El tipo de datos de la propiedad.
 *   - Tipos Comunes:
 *     - `string`: Texto o caracteres.
 *     - `number`: Números enteros o decimales.
 *     - `boolean`: Verdadero o falso.
 *     - `date`: Fechas.
 *     - `array`: Lista de elementos.
 *     - `base64`: Datos codificados en base64, generalmente para almacenar imágenes o archivos.
 * @property {string} label - Un nombre legible para humanos que describe la propiedad. Ejemplo: "Nombre", "Correo Electrónico", "Rol".
 * @property {boolean} showInTable - Un booleano que indica si esta propiedad debe mostrarse en la vista de tabla. Valores: `true` o `false`.
 * @property {boolean} showInForm - Un booleano que indica si esta propiedad debe mostrarse en el formulario de entrada. Valores: `true` o `false`.
 * @property {string} inputType - El tipo de entrada HTML que se debe usar para esta propiedad.
 *   - Tipos Comunes:
 *     - `text`: Entrada de texto.
 *     - `number`: Entrada numérica.
 *     - `select`: Menú desplegable.
 *     - `checkbox`: Casilla de verificación.
 *     - `radio`: Botón de radio.
 *     - `file`: Entrada de archivo para cargar imágenes o documentos.
 *     - `link`: Enlace para gestionar asociaciones con otras entidades.
 *     - `password`: Entrada de contraseña.
 *     - `date`: Entrada de fecha.
 *     - `textarea`: Área de texto.
 * @property {*} default - El valor predeterminado de la propiedad si no se proporciona uno. Ejemplo: `""` para texto vacío, `0` para números.
 * @property {boolean} required - Un booleano que indica si esta propiedad es obligatoria. Valores: `true` o `false`.
 * @property {string} documentation - Una descripción legible para humanos que explica la propiedad. Se utiliza para mostrar tooltips. Ejemplo: "El nombre completo del usuario", "El correo electrónico del usuario".
 * @property {string} pattern - Una expresión regular para validar la entrada de texto o numérica. Ejemplo: `"^[a-zA-Z\\s]+$"` para solo letras y espacios, `"^\\d+(\\.\\d{1,2})?$"` para precios con hasta dos decimales.
 * @property {boolean} sortable - Un booleano que indica si esta propiedad es ordenable en la vista de tabla. Valores: `true` o `false`.
 * @property {Array.<string>} options - Una lista de opciones disponibles para una propiedad de tipo `select`. Ejemplo: `["admin", "user"]` para un menú desplegable de roles.
 * @property {string} linkTo - La entidad a la que se vincula esta propiedad, generalmente utilizada en propiedades de tipo `select` o `link`. Ejemplo: `"users"` si la propiedad se relaciona con la entidad de usuarios.
 * @property {string} optionLabel - El nombre de la propiedad en la entidad vinculada que se debe mostrar como etiqueta en el menú desplegable. Ejemplo: `"name"` si queremos mostrar el nombre del usuario en un menú desplegable.
 */

/**
 * Ejemplo de Configuración de una Entidad
 * 
 * const Entities = {
 *   users: {
 *     label: "Usuarios",
 *     properties: {
 *       name: { 
 *         type: "string", 
 *         label: "Nombre", 
 *         showInTable: true, 
 *         showInForm: true, 
 *         inputType: "text", 
 *         default: "", 
 *         required: true,
 *         documentation: "El nombre completo del usuario",
 *         pattern: "^[a-zA-Z\\s]+$",
 *         sortable: true
 *       },
 *       email: { 
 *         type: "string", 
 *         label: "Correo Electrónico", 
 *         showInTable: true, 
 *         showInForm: true, 
 *         inputType: "text", 
 *         default: "",
 *         documentation: "El correo electrónico del usuario",
 *         pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
 *         sortable: true
 *       },
 *       password: {
 *         type: "string",
 *         label: "Contraseña",
 *         showInTable: false,
 *         showInForm: true,
 *         inputType: "password",
 *         required: true,
 *         documentation: "La contraseña del usuario"
 *       },
 *       role: { 
 *         type: "string", 
 *         label: "Rol", 
 *         showInTable: true, 
 *         showInForm: true, 
 *         inputType: "select", 
 *         options: ["admin", "user"], 
 *         default: "user",
 *         documentation: "El rol del usuario en el sistema",
 *         sortable: true
 *       },
 *       gender: {
 *         type: "string",
 *         label: "Género",
 *         showInTable: true,
 *         showInForm: true,
 *         inputType: "radio",
 *         options: ["Masculino", "Femenino", "Otro"],
 *         default: "Otro",
 *         required: true,
 *         documentation: "El género del usuario"
 *       }
 *     }
 *   },
 *   products: {
 *     label: "Productos",
 *     properties: {
 *       name: { 
 *         type: "string", 
 *         label: "Nombre", 
 *         showInTable: true, 
 *         showInForm: true, 
 *         inputType: "text", 
 *         default: "" 
 *       },
 *       price: { 
 *         type: "number", 
 *         label: "Precio", 
 *         showInTable: true, 
 *         showInForm: true, 
 *         inputType: "number", 
 *         default: 0 
 *       },
 *       stock: { 
 *         type: "number", 
 *         label: "Stock", 
 *         showInTable: true, 
 *         showInForm: true, 
 *         inputType: "number", 
 *         default: 0 
 *       },
 *       image: { 
 *         type: "base64", 
 *         label: "Imagen", 
 *         showInTable: true, 
 *         showInForm: true, 
 *         inputType: "file" 
 *       },
 *       description: { 
 *         type: "string", 
 *         label: "Descripción", 
 *         showInTable: false, 
 *         showInForm: true, 
 *         inputType: "textarea", 
 *         default: "" 
 *       },
 *       releaseDate: {
 *         type: "date",
 *         label: "Fecha de Lanzamiento",
 *         showInTable: true,
 *         showInForm: true,
 *         inputType: "date",
 *         default: ""
 *       }
 *     }
 *   }
 * };
 * 
 * export default Entities;
 */


/**
 * Entidad: Usuario
 *
 * @typedef {Object} User
 * @property {string} label - "Usuario"
 * @property {Object.<string, Property>} properties - Las propiedades del usuario.
 */
const User = {
    label: "Usuario",
    category: "Administración",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del usuario",
            sortable: true
        },
        name: {
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
            label: "Rol",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "user",
            required: true,
            documentation: "El rol del usuario",
            options: ["Admin", "User"],
            sortable: true
        }
    }
};

/**
 * Entidad: Proveedor
 *
 * @typedef {Object} Supplier
 * @property {string} label - "Proveedor"
 * @property {Object.<string, Property>} properties - Las propiedades del proveedor.
 */
const Supplier = {
    label: "Proveedor",
    category: "Administración",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del proveedor",
            sortable: true
        },
        name: {
            type: "string",
            label: "Nombre del Proveedor",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "El nombre del proveedor",
            pattern: "^[a-zA-Z\\s]+$",
            sortable: true
        }
    }
};

/**
 * Entidad: Orden de Compra
 *
 * @typedef {Object} PurchaseOrder
 * @property {string} label - "Orden de Compra"
 * @property {Object.<string, Property>} properties - Las propiedades de la orden de compra.
 */
const PurchaseOrder = {
    label: "Orden de Compra",
    category: "Compras",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único de la orden de compra",
            sortable: true
        },
        supplierId: {
            type: "string",
            label: "Proveedor",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El proveedor asociado a la orden de compra",
            linkTo: "Supplier",
            optionLabel: "name",
            sortable: true
        },
        userId: {
            type: "string",
            label: "Usuario",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El usuario que creó la orden de compra",
            linkTo: "User",
            optionLabel: "name",
            sortable: true
        },
        totalAmount: {
            type: "number",
            label: "Importe Total",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "El importe total de la orden de compra",
            sortable: true
        }
    }
};

/**
 * Entidad: Lista de Compra
 *
 * @typedef {Object} PurchaseList
 * @property {string} label - "Lista de Compra"
 * @property {Object.<string, Property>} properties - Las propiedades de la lista de compra.
 */
const PurchaseList = {
    label: "Lista de Compra",
    category: "Compras",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único de la lista de compra",
            sortable: true
        },
        purchaseOrderId: {
            type: "string",
            label: "Orden de Compra",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "La orden de compra asociada a la lista de compra",
            linkTo: "PurchaseOrder",
            optionLabel: "id",
            sortable: true
        },
        productId: {
            type: "string",
            label: "Producto",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El producto en la lista de compra",
            linkTo: "Product",
            optionLabel: "name",
            sortable: true
        },
        quantity: {
            type: "number",
            label: "Cantidad",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 1,
            required: true,
            documentation: "La cantidad de producto a pedir",
            sortable: true
        },
        amount: {
            type: "number",
            label: "Importe",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "El importe del producto",
            sortable: true
        }
    }
};

/**
 * Entidad: Producto
 *
 * @typedef {Object} Product
 * @property {string} label - "Producto"
 * @property {Object.<string, Property>} properties - Las propiedades del producto.
 */
const Product = {
    label: "Producto",
    category: "Administración",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del producto",
            sortable: true
        },
        name: {
            type: "string",
            label: "Nombre del Producto",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "El nombre del producto",
            pattern: "^[a-zA-Z\\s]+$",
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
            documentation: "El precio del producto",
            sortable: true
        },
        stockDesired: {
            type: "number",
            label: "Stock Deseado",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "La cantidad deseada de stock para el producto",
            sortable: true
        },
        image: {
            type: "base64",
            label: "Imagen",
            showInTable: false,
            showInForm: true,
            inputType: "file",
            default: "",
            required: false,
            documentation: "La imagen del producto",
            sortable: false
        }
    }
};

/**
 * Entidad: Control de Calidad
 *
 * @typedef {Object} QualityCheck
 * @property {string} label - "Control de Calidad"
 * @property {Object.<string, Property>} properties - Las propiedades del control de calidad.
 */
const QualityCheck = {
    label: "Control de Calidad",
    category: "Administración",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del control de calidad",
            sortable: true
        },
        productId: {
            type: "string",
            label: "Producto",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El producto inspeccionado",
            linkTo: "Product",
            optionLabel: "name",
            sortable: true
        },
        userId: {
            type: "string",
            label: "Usuario",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El usuario que realizó el control de calidad",
            linkTo: "User",
            optionLabel: "name",
            sortable: true
        },
        date: {
            type: "date",
            label: "Fecha",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha del control de calidad",
            sortable: true
        },
        result: {
            type: "string",
            label: "Resultado",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "pass",
            required: true,
            documentation: "El resultado del control de calidad",
            options: ["pass", "fail"],
            sortable: true
        },
        notes: {
            type: "string",
            label: "Notas",
            showInTable: false,
            showInForm: true,
            inputType: "textarea",
            default: "",
            required: false,
            documentation: "Notas adicionales sobre el control de calidad",
            sortable: false
        }
    }
};

/**
 * Entidad: Problema de Calidad
 *
 * @typedef {Object} QualityIssue
 * @property {string} label - "Problema de Calidad"
 * @property {Object.<string, Property>} properties - Las propiedades del problema de calidad.
 */
const QualityIssue = {
    label: "Problema de Calidad",
    category: "Administración",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del problema de calidad",
            sortable: true
        },
        qualityCheckId: {
            type: "string",
            label: "Control de Calidad",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El control de calidad asociado al problema",
            linkTo: "QualityCheck",
            optionLabel: "id",
            sortable: true
        },
        description: {
            type: "string",
            label: "Descripción",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Descripción del problema de calidad",
            sortable: true
        },
        severity: {
            type: "string",
            label: "Severidad",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "low",
            required: true,
            documentation: "La severidad del problema de calidad",
            options: ["low", "medium", "high"],
            sortable: true
        },
        dateReported: {
            type: "date",
            label: "Fecha de Reporte",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha en que se reportó el problema de calidad",
            sortable: true
        },
        status: {
            type: "string",
            label: "Estado",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "open",
            required: true,
            documentation: "El estado del problema de calidad",
            options: ["open", "in progress", "resolved"],
            sortable: true
        },
        notes: {
            type: "string",
            label: "Notas",
            showInTable: false,
            showInForm: true,
            inputType: "textarea",
            default: "",
            required: false,
            documentation: "Notas adicionales sobre el problema de calidad",
            sortable: false
        }
    }
};

/**
 * Entidad: Tarea
 *
 * @typedef {Object} Task
 * @property {string} label - "Tarea"
 * @property {Object.<string, Property>} properties - Las propiedades de la tarea.
 */
const Task = {
    label: "Tarea",
    category: "Administración",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único de la tarea",
            sortable: true
        },
        title: {
            type: "string",
            label: "Título",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "El título de la tarea",
            sortable: true
        },
        description: {
            type: "string",
            label: "Descripción",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: false,
            documentation: "La descripción de la tarea",
            sortable: true
        },
        priority: {
            type: "string",
            label: "Prioridad",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "medium",
            required: true,
            documentation: "La prioridad de la tarea",
            options: ["low", "medium", "high"],
            sortable: true
        },
        dueDate: {
            type: "date",
            label: "Fecha de Vencimiento",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha de vencimiento de la tarea",
            sortable: true
        },
        status: {
            type: "string",
            label: "Estado",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "pending",
            required: true,
            documentation: "El estado de la tarea",
            options: ["pending", "in progress", "completed"],
            sortable: true
        },
        assignedTo: {
            type: "string",
            label: "Asignado a",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El usuario asignado a la tarea",
            linkTo: "User",
            optionLabel: "name",
            sortable: true
        }
    }
};

/**
 * Entidad: Asignación de Tarea
 *
 * @typedef {Object} TaskAssignment
 * @property {string} label - "Asignación de Tarea"
 * @property {Object.<string, Property>} properties - Las propiedades de la asignación de tarea.
 */
const TaskAssignment = {
    label: "Asignación de Tarea",
    category: "Administración",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único de la asignación de tarea",
            sortable: true
        },
        taskId: {
            type: "string",
            label: "Tarea",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "La tarea asignada",
            linkTo: "Task",
            optionLabel: "title",
            sortable: true
        },
        userId: {
            type: "string",
            label: "Usuario",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El usuario al que se le asigna la tarea",
            linkTo: "User",
            optionLabel: "name",
            sortable: true
        },
        dateAssigned: {
            type: "date",
            label: "Fecha de Asignación",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha en que se asignó la tarea",
            sortable: true
        }
    }
};

/**
 * Entidad: Plan de Producción
 *
 * @typedef {Object} ProductionPlan
 * @property {string} label - "Plan de Producción"
 * @property {Object.<string, Property>} properties - Las propiedades del plan de producción.
 */
const ProductionPlan = {
    label: "Plan de Producción",
    category: "Producción",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del plan de producción",
            sortable: true
        },
        productId: {
            type: "string",
            label: "Producto",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El producto a producir",
            linkTo: "Product",
            optionLabel: "name",
            sortable: true
        },
        quantity: {
            type: "number",
            label: "Cantidad",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "La cantidad de producto a producir",
            sortable: true
        },
        startDate: {
            type: "date",
            label: "Fecha de Inicio",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha de inicio de la producción",
            sortable: true
        },
        endDate: {
            type: "date",
            label: "Fecha de Fin",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha de fin de la producción",
            sortable: true
        },
        status: {
            type: "string",
            label: "Estado",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "planned",
            required: true,
            documentation: "El estado del plan de producción",
            options: ["planned", "in progress", "completed"],
            sortable: true
        },
        notes: {
            type: "string",
            label: "Notas",
            showInTable: false,
            showInForm: true,
            inputType: "textarea",
            default: "",
            required: false,
            documentation: "Notas adicionales sobre el plan de producción",
            sortable: false
        }
    }
};

/**
 * Entidad: Programación de Producción
 *
 * @typedef {Object} ProductionSchedule
 * @property {string} label - "Programación de Producción"
 * @property {Object.<string, Property>} properties - Las propiedades de la programación de producción.
 */
const ProductionSchedule = {
    label: "Programación de Producción",
    category: "Producción",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único de la programación de producción",
            sortable: true
        },
        productionPlanId: {
            type: "string",
            label: "Plan de Producción",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El plan de producción asociado",
            linkTo: "ProductionPlan",
            optionLabel: "id",
            sortable: true
        },
        userId: {
            type: "string",
            label: "Usuario",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El usuario que programó la producción",
            linkTo: "User",
            optionLabel: "name",
            sortable: true
        },
        scheduledDate: {
            type: "date",
            label: "Fecha Programada",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha programada para la producción",
            sortable: true
        },
        status: {
            type: "string",
            label: "Estado",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "scheduled",
            required: true,
            documentation: "El estado de la programación de producción",
            options: ["scheduled", "in progress", "completed"],
            sortable: true
        },
        notes: {
            type: "string",
            label: "Notas",
            showInTable: false,
            showInForm: true,
            inputType: "textarea",
            default: "",
            required: false,
            documentation: "Notas adicionales sobre la programación de producción",
            sortable: false
        }
    }
};

/**
 * Entidad: Empleado
 *
 * @typedef {Object} Employee
 * @property {string} label - "Empleado"
 * @property {Object.<string, Property>} properties - Las propiedades del empleado.
 */
const Employee = {
    label: "Empleado",
    category: "Recursos Humano",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del empleado",
            sortable: true
        },
        userId: {
            type: "string",
            label: "Usuario",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El usuario asociado al empleado",
            linkTo: "User",
            optionLabel: "name",
            sortable: true
        },
        position: {
            type: "string",
            label: "Posición",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "La posición del empleado",
            sortable: true
        },
        startDate: {
            type: "date",
            label: "Fecha de Inicio",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha de inicio del empleado",
            sortable: true
        },
        salary: {
            type: "number",
            label: "Salario",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "El salario del empleado",
            sortable: true
        }
    }
};

/**
 * Entidad: Asistencia
 *
 * @typedef {Object} Attendance
 * @property {string} label - "Asistencia"
 * @property {Object.<string, Property>} properties - Las propiedades de la asistencia.
 */
const Attendance = {
    label: "Asistencia",
    category: "Recursos Humano",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único de la asistencia",
            sortable: true
        },
        employeeId: {
            type: "string",
            label: "Empleado",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El empleado asociado a la asistencia",
            linkTo: "Employee",
            optionLabel: "id",
            sortable: true
        },
        date: {
            type: "date",
            label: "Fecha",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha de la asistencia",
            sortable: true
        },
        checkIn: {
            type: "string",
            label: "Hora de Entrada",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "La hora de entrada del empleado",
            pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$", // 24-hour time format
            sortable: true
        },
        checkOut: {
            type: "string",
            label: "Hora de Salida",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "La hora de salida del empleado",
            pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$", // 24-hour time format
            sortable: true
        }
    }
};

/**
 * Entidad: Turno
 *
 * @typedef {Object} Shift
 * @property {string} label - "Turno"
 * @property {Object.<string, Property>} properties - Las propiedades del turno.
 */
const Shift = {
    label: "Turno",
    category: "Recursos Humano",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del turno",
            sortable: true
        },
        employeeId: {
            type: "string",
            label: "Empleado",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El empleado asignado al turno",
            linkTo: "Employee",
            optionLabel: "id",
            sortable: true
        },
        date: {
            type: "date",
            label: "Fecha",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha del turno",
            sortable: true
        },
        startTime: {
            type: "string",
            label: "Hora de Inicio",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "La hora de inicio del turno",
            pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$", // 24-hour time format
            sortable: true
        },
        endTime: {
            type: "string",
            label: "Hora de Fin",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "La hora de fin del turno",
            pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$", // 24-hour time format
            sortable: true
        }
    }
};

/**
 * Entidad: Nómina
 *
 * @typedef {Object} Payroll
 * @property {string} label - "Nómina"
 * @property {Object.<string, Property>} properties - Las propiedades de la nómina.
 */
const Payroll = {
    label: "Nómina",
    category: "Recursos Humano",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único de la nómina",
            sortable: true
        },
        employeeId: {
            type: "string",
            label: "Empleado",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El empleado asociado a la nómina",
            linkTo: "Employee",
            optionLabel: "id",
            sortable: true
        },
        periodStart: {
            type: "date",
            label: "Inicio del Periodo",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha de inicio del periodo de pago",
            sortable: true
        },
        periodEnd: {
            type: "date",
            label: "Fin del Periodo",
            showInTable: true,
            showInForm: true,
            inputType: "date",
            default: "",
            required: true,
            documentation: "La fecha de fin del periodo de pago",
            sortable: true
        },
        totalHours: {
            type: "number",
            label: "Horas Totales",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "El total de horas trabajadas en el periodo",
            sortable: true
        },
        totalEarnings: {
            type: "number",
            label: "Ingresos Totales",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "El total de ingresos del empleado en el periodo",
            sortable: true
        }
    }
};

/**
 * Entidad: Ingrediente
 *
 * @typedef {Object} Ingredient
 * @property {string} label - "Ingrediente"
 * @property {Object.<string, Property>} properties - Las propiedades del ingrediente.
 */
const Ingredient = {
    label: "Ingrediente",
    category: "Recetario",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del ingrediente",
            sortable: true
        },
        productId: {
            type: "string",
            label: "Producto",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El producto asociado al ingrediente",
            linkTo: "Product",
            optionLabel: "name",
            sortable: true
        },
        quantity: {
            type: "number",
            label: "Cantidad",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "La cantidad del producto utilizado como ingrediente",
            sortable: true
        }
    }
};

/**
 * Entidad: Receta
 *
 * @typedef {Object} Recipe
 * @property {string} label - "Receta"
 * @property {Object.<string, Property>} properties - Las propiedades de la receta.
 */
const Recipe = {
    label: "Receta",
    category: "Recetario",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: false,
            documentation: "Identificador único de la receta",
            sortable: false
        },
        name: {
            type: "string",
            label: "Nombre de la Receta",
            showInTable: true,
            showInForm: true,
            inputType: "text",
            default: "",
            required: true,
            documentation: "El nombre de la receta",
            pattern: "^[a-zA-Z\\s]+$",
            sortable: true
        },
        description: {
            type: "string",
            label: "Descripción",
            showInTable: true,
            showInForm: true,
            inputType: "textarea",
            default: "",
            required: false,
            documentation: "Descripción de la receta",
            sortable: true
        },
        ingredients: {
            type: "array",
            label: "Ingredientes",
            showInTable: false,
            showInForm: true,
            inputType: "link",
            default: [],
            required: true,
            documentation: "Lista de ingredientes de la receta",
            linkTo: "ingredient",
            optionLabel: "productId",
            sortable: false
        }
    }
};

/**
 * Entidad: Costo de Receta
 *
 * @typedef {Object} RecipeCost
 * @property {string} label - "Costo de Receta"
 * @property {Object.<string, Property>} properties - Las propiedades del costo de la receta.
 */
const RecipeCost = {
    label: "Costo de Receta",
    category: "Recetario",
    accessibleByRoles: ["Admin", "User"],
    properties: {
        id: {
            type: "string",
            label: "ID",
            showInTable: false,
            showInForm: false,
            inputType: "text",
            default: "",
            required: true,
            documentation: "Identificador único del costo de la receta",
            sortable: true
        },
        recipeId: {
            type: "string",
            label: "Receta",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "La receta asociada",
            linkTo: "Recipe",
            optionLabel: "name",
            sortable: true
        },
        ingredientId: {
            type: "string",
            label: "Ingrediente",
            showInTable: true,
            showInForm: true,
            inputType: "select",
            default: "",
            required: true,
            documentation: "El ingrediente asociado",
            linkTo: "Ingredient",
            optionLabel: "productId",
            sortable: true
        },
        quantity: {
            type: "number",
            label: "Cantidad",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "La cantidad del ingrediente utilizado",
            sortable: true
        },
        cost: {
            type: "number",
            label: "Costo",
            showInTable: true,
            showInForm: true,
            inputType: "number",
            default: 0,
            required: true,
            documentation: "El costo del ingrediente utilizado",
            sortable: true
        }
    }
};

const Entities = {
    "user": User,
    "supplier": Supplier,
    "purchaseOrder": PurchaseOrder,
    "purchaseList": PurchaseList,
    "product": Product,
    "qualityCheck": QualityCheck,
    "qualityIssue": QualityIssue,
    "task": Task,
    "taskAssignment": TaskAssignment,
    "productionPlan": ProductionPlan,
    "productionSchedule": ProductionSchedule,
    "employee": Employee,
    "attendance": Attendance,
    "shift": Shift,
    "payroll": Payroll,
    "ingredient": Ingredient,
    "recipe": Recipe,
    "recipeCost": RecipeCost
};

export default Entities;
