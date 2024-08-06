# Documentación de Configuración de Entidades

## Características de una Entidad

### Entity

- `label` (string): Un nombre legible para humanos que describe la entidad.
- `properties` (Object.<string, Property>): Un objeto que define las propiedades de la entidad. Cada propiedad tiene varias subcaracterísticas que determinan su comportamiento y apariencia.
- `category` (string): La categoría de la entidad, útil para organizar y agrupar entidades. Ejemplo: "Cat".
- `accessibleByRoles` (Array.<string>): Una lista de roles que pueden acceder a esta entidad. Ejemplo: `["Admin", "User"]`.
- `showMenu` (boolean): Un booleano que indica si esta entidad debe mostrarse en el menú de navegación. Valores: `true` o `false`.

### Property

- `type` (string): El tipo de datos de la propiedad.
  - Tipos Comunes:
    - `string`: Texto o caracteres.
    - `number`: Números enteros o decimales.
    - `boolean`: Verdadero o falso.
    - `date`: Fechas.
    - `array`: Lista de elementos.
    - `base64`: Datos codificados en base64, generalmente para almacenar imágenes o archivos.
- `label` (string): Un nombre legible para humanos que describe la propiedad. Ejemplo: "Nombre", "Correo Electrónico", "Rol".
- `showInTable` (boolean): Un booleano que indica si esta propiedad debe mostrarse en la vista de tabla. Valores: `true` o `false`.
- `showInForm` (boolean): Un booleano que indica si esta propiedad debe mostrarse en el formulario de entrada. Valores: `true` o `false`.
- `inputType` (string): El tipo de entrada HTML que se debe usar para esta propiedad.
  - Tipos Comunes:
    - `text`: Entrada de texto.
    - `number`: Entrada numérica.
    - `select`: Menú desplegable.
    - `checkbox`: Casilla de verificación.
    - `radio`: Botón de radio.
    - `file`: Entrada de archivo para cargar imágenes o documentos.
    - `link`: Enlace para gestionar asociaciones con otras entidades.
    - `password`: Entrada de contraseña.
    - `date`: Entrada de fecha.
    - `textarea`: Área de texto.
- `default` (*): El valor predeterminado de la propiedad si no se proporciona uno. Ejemplo: `""` para texto vacío, `0` para números, `new Date()` para la fecha actual, `true` o `false` para valores booleanos.
- `required` (boolean): Un booleano que indica si esta propiedad es obligatoria. Valores: `true` o `false`.
- `documentation` (string): Una descripción legible para humanos que explica la propiedad. Se utiliza para mostrar tooltips. Ejemplo: "El nombre completo del usuario", "El correo electrónico del usuario".
- `pattern` (string): Una expresión regular para validar la entrada de texto o numérica. Ejemplo: `"^[a-zA-Z\\s]+$"` para solo letras y espacios, `"^\\d+(\\.\\d{1,2})?$"` para precios con hasta dos decimales.
- `sortable` (boolean): Un booleano que indica si esta propiedad es ordenable en la vista de tabla. Valores: `true` o `false`.
- `options` (Array.<string>): Una lista de opciones disponibles para una propiedad de tipo `select`. Ejemplo: `["admin", "user"]` para un menú desplegable de roles.
- `labelRef` (string): El patrón de etiquetas que se debe tomar de la entidad referenciada para mostrar. Puede ser una sola propiedad o varias separadas por un guion. Ejemplo: `"propiedad1 - propiedad2"`.

## Convenciones para Propiedades de Referencia

Las propiedades que contienen la palabra clave "Ref" son consideradas referencias a otras entidades. Si se divide en dos la palabra clave, la parte inicial del nombre de la propiedad es el nombre de la propiedad, y la última parte se utiliza como el nombre de la entidad referenciada, siempre poniendo la primera letra de la entidad en minúscula.

### Ejemplos:
- `userOwnerRefUsers`: hace referencia a la entidad "users".
- `productRefProducts`: hace referencia a la entidad "products".


La propiedad `labelRef` se utiliza para definir qué propiedades de la entidad referenciada se deben mostrar como etiqueta. Puede ser una sola propiedad o varias separadas por un guion. Ejemplo: `"name - email"`.

## Ejemplo de Configuración de una Entidad

```javascript
const Entities = {
  users: {
    label: "Usuarios",
    category: "User Management",
    accessibleByRoles: ["Admin", "User"],
    showMenu: true,
    properties: {
      name: { 
        type: "string", 
        label: "Nombre", 
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
        documentation: "El correo electrónico del usuario",
        pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        sortable: true
      },
      password: {
        type: "string",
        label: "Contraseña",
        showInTable: false,
        showInForm: true,
        inputType: "password",
        required: true,
        documentation: "La contraseña del usuario"
      },
      role: { 
        type: "string", 
        label: "Rol", 
        showInTable: true, 
        showInForm: true, 
        inputType: "select", 
        options: ["admin", "user"], 
        default: "user",
        documentation: "El rol del usuario en el sistema",
        sortable: true
      },
      gender: {
        type: "string",
        label: "Género",
        showInTable: true,
        showInForm: true,
        inputType: "radio",
        options: ["Masculino", "Femenino", "Otro"],
        default: "Otro",
        required: true,
        documentation: "El género del usuario"
      }
    }
  },
  products: {
    label: "Productos",
    category: "Inventory",
    accessibleByRoles: ["Admin"],
    showMenu: true,
    properties: {
      name: { 
        type: "string", 
        label: "Nombre", 
        showInTable: true, 
        showInForm: true, 
        inputType: "text", 
        default: "" 
      },
      price: { 
        type: "number", 
        label: "Precio", 
        showInTable: true, 
        showInForm: true, 
        inputType: "number", 
        default: 0 
      },
      stock: { 
        type: "number", 
        label: "Stock", 
        showInTable: true, 
        showInForm: true, 
        inputType: "number", 
        default: 0 
      },
      image: { 
        type: "base64", 
        label: "Imagen", 
        showInTable: true, 
        showInForm: true, 
        inputType: "file" 
      },
      description: { 
        type: "string", 
        label: "Descripción", 
        showInTable: false, 
        showInForm: true, 
        inputType: "textarea", 
        default: "" 
      },
      releaseDate: {
        type: "date",
        label: "Fecha de Lanzamiento",
        showInTable: true,
        showInForm: true,
        inputType: "date",
        default: new Date()
      },
      supplierRefEntity: {
        type: "string",
        label: "Proveedor",
        showInTable: true,
        showInForm: true,
        inputType: "link",
        labelRef: "name - email",
        default: ""
      }
    }
  },
  orders: {
    label: "Órdenes",
    category: "Sales",
    accessibleByRoles: ["Admin", "Sales"],
    showMenu: true,
    properties: {
      orderNumber: { 
        type: "string", 
        label: "Número de Orden", 
        showInTable: true, 
        showInForm: true, 
        inputType: "text", 
        default: "" 
      },
      date: { 
        type: "date", 
        label: "Fecha", 
        showInTable: true, 
        showInForm: true, 
        inputType: "date", 
        default: new Date() 
      },
      customerRefEntity: {
        type: "string",
        label: "Cliente",
        showInTable: true,
        showInForm: true,
        inputType: "link",
        labelRef: "name - email",
        default: ""
      },
      items: { 
        type: "array", 
        label: "Artículos", 
        showInTable: false, 
        showInForm: true, 
        inputType: "textarea", 
        default: [] 
      },
      totalAmount: { 
        type: "number", 
        label: "Monto Total", 
        showInTable: true, 
        showInForm: true, 
        inputType: "number", 
        default: 0 
      },
      status: { 
        type: "string", 
        label: "Estado", 
        showInTable: true, 
        showInForm: true, 
        inputType: "select", 
        options: ["Pendiente", "Completada", "Cancelada"], 
        default: "Pendiente"
      }
    }
  }
};

export default Entities;
