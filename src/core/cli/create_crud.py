import os

# Función para leer las plantillas desde los archivos .template
def read_template(template_name):
    base_path = os.path.dirname(os.path.realpath(__file__))
    template_path = os.path.join(base_path, f"templates/{template_name}.template")
    with open(template_path, 'r') as file:
        return file.read()

# Leer las plantillas
model_template = read_template("model")
list_controller_template = read_template("list_controller")
form_controller_template = read_template("form_controller")
view_list_template = read_template("view_list")
view_form_template = read_template("view_form")

# Función para solicitar propiedades y sus características
def get_model_schema():
    properties = []
    while True:
        name = input("Ingrese el nombre de la propiedad (o presione Enter para terminar): ").strip()
        if not name:
            break

        prop_type = input(f"Seleccione el tipo de '{name}' (string, number, date, array): ").strip().lower()
        default_value = input(f"Ingrese el valor por defecto para '{name}' (opcional): ").strip()
        required = input(f"¿'{name}' es obligatorio? (s/n): ").strip().lower() == 's'
        unique = input(f"¿'{name}' es único? (s/n): ").strip().lower() == 's' if prop_type == 'string' else False

        constraints = []
        if required:
            constraints.append("required: true")
        if unique:
            constraints.append("unique: true")

        constraints_str = f", constraints: {{ {', '.join(constraints)} }}" if constraints else ""

        property_str = f"{name}: {{ type: '{prop_type}', default: '{default_value}'{constraints_str} }}".strip()
        properties.append(property_str)

    schema = "schema: {\n        " + ",\n        ".join(properties) + "\n    }"
    return schema

# Función para actualizar GetCollectionModelMap.js
def update_get_collection_model_map(ModelName):
    model_import_line = f"import {ModelName} from './{ModelName}.js';\n"
    model_map_line = f"        '{ModelName}s': {ModelName},\n"

    base_path = os.path.dirname(os.path.realpath(__file__))
    get_collection_model_map_path = os.path.join(base_path, "../../app/models/GetCollectionModelMap.js")

    if os.path.exists(get_collection_model_map_path):
        with open(get_collection_model_map_path, 'r') as file:
            content = file.readlines()

        # Encontrar la última línea de importación
        last_import_index = next(i for i, line in enumerate(content) if not line.startswith("import"))
        content.insert(last_import_index, model_import_line)

        # Encontrar la línea que contiene "};" y agregar antes de ella
        for i, line in enumerate(content):
            if "};" in line:
                content.insert(i, model_map_line)
                break

        # Escribir los cambios en el archivo
        with open(get_collection_model_map_path, 'w') as file:
            file.writelines(content)

        print(f"{ModelName} añadido a GetCollectionModelMap.js")
    else:
        print(f"Error: {get_collection_model_map_path} no encontrado.")

# Función para actualizar RouteAppConfig.js con la vista de lista o formulario
def update_router(ViewName, route, ControllerName):
    base_path = os.path.dirname(os.path.realpath(__file__))
    router_path = os.path.join(base_path, "../../app/config/RouteAppConfig.js")

    view_import_line = f"import {ViewName} from '../views/{ViewName}.js';\n"
    route_line = f'    "/{route}": {{ render: vnode => m(MainLayout, m({ViewName}, vnode.attrs)) }},\n'
    form_route_lines = (
        f'    "/{route}/new": {{ render: vnode => m(MainLayout, m({ViewName}, vnode.attrs)) }},\n'
        f'    "/{route}/:id": {{ render: vnode => m(MainLayout, m({ViewName}, vnode.attrs)) }},\n'
    )

    if os.path.exists(router_path):
        with open(router_path, 'r') as file:
            content = file.readlines()

        # Insertar la importación justo después de la última línea de importación existente
        last_import_index = next(i for i, line in enumerate(content) if not line.startswith("import"))
        content.insert(last_import_index, view_import_line)

        # Insertar las nuevas rutas justo antes de la línea que contiene "};"
        for i, line in enumerate(content):
            if "};" in line:
                if 'form' in ViewName.lower():
                    content.insert(i, form_route_lines)
                else:
                    content.insert(i, route_line)
                break

        # Escribir los cambios en el archivo
        with open(router_path, 'w') as file:
            file.writelines(content)

        print(f"Rutas añadidas a RouteAppConfig.js")
    else:
        print(f"Error: {router_path} no encontrado.")

# Función para actualizar MenuConfig.js
def update_menu(prefix):
    menu_line = f'    "{prefix.lower()}": {{"label": "{prefix}s", "category": "Gestión", "pathRouter": "/{prefix.lower()}"}},'

    base_path = os.path.dirname(os.path.realpath(__file__))
    menu_path = os.path.join(base_path, "../../app/config/MenuConfig.js")

    if os.path.exists(menu_path):
        with open(menu_path, 'r') as file:
            content = file.readlines()

        # Encontrar la línea que contiene "};" y agregar antes de ella
        for i, line in enumerate(content):
            if "};" in line:
                content.insert(i, menu_line)
                break

        # Escribir los cambios en el archivo
        with open(menu_path, 'w') as file:
            file.writelines(content)

        print(f"Entrada añadida al menú en MenuConfig.js")
    else:
        print(f"Error: {menu_path} no encontrado.")

# Función para crear archivos
def create_file(path, content):
    directory = os.path.dirname(path)
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(path, 'w') as file:
        file.write(content)

# Función para solicitar confirmación al usuario
def prompt_user(prompt):
    return input(f"{prompt} (s/n): ").strip().lower() == 's'

# Función para crear archivos de vistas y controladores
def create_view_controller_files(prefix):
    # Define nombres de archivo y ruta
    model_name = prefix
    list_controller_name = f"{prefix}ListController"
    list_view_name = f"{prefix}ListView"
    form_controller_name = f"{prefix}FormController"
    form_view_name = f"{prefix}FormView"

    # Rutas relativas basadas en la estructura de tu proyecto
    base_path = os.path.dirname(os.path.realpath(__file__))
    model_path = os.path.join(base_path, f"../../app/models/{model_name}.js")
    list_controller_path = os.path.join(base_path, f"../../app/controllers/{list_controller_name}.js")
    list_view_path = os.path.join(base_path, f"../../app/views/{list_view_name}.js")
    form_controller_path = os.path.join(base_path, f"../../app/controllers/{form_controller_name}.js")
    form_view_path = os.path.join(base_path, f"../../app/views/{form_view_name}.js")

    # Preguntar si desea crear el modelo
    if prompt_user("¿Desea crear el modelo?"):
        schema = get_model_schema()
        model_content = model_template.format(ModelName=model_name, schema=schema)
        create_file(model_path, model_content)
        print(f"Modelo creado: {model_path}")

        # Actualizar GetCollectionModelMap.js
        update_get_collection_model_map(model_name)

    # Preguntar si desea crear el controlador y la vista para la lista
    if prompt_user("¿Desea crear el controlador y la vista para la lista?"):
        list_controller_content = list_controller_template.format(ControllerName=list_controller_name, ModelName=model_name, route=prefix.lower())
        create_file(list_controller_path, list_controller_content)
        print(f"Controlador de lista creado: {list_controller_path}")

        list_view_content = view_list_template.format(ControllerName=list_controller_name, ViewName=list_view_name, Title=prefix.capitalize(), route=prefix.lower())
        create_file(list_view_path, list_view_content)
        print(f"Vista de lista creada: {list_view_path}")

        # Actualizar el router con la vista de lista
        update_router(list_view_name, prefix.lower(), list_controller_name)

        # Actualizar el menú
        update_menu(prefix)

    # Preguntar si desea crear el controlador y la vista para el formulario
    if prompt_user("¿Desea crear el controlador y la vista para el formulario?"):
        form_controller_content = form_controller_template.format(ControllerName=form_controller_name, ModelName=model_name, route=prefix.lower())
        create_file(form_controller_path, form_controller_content)
        print(f"Controlador de formulario creado: {form_controller_path}")

        form_view_content = view_form_template.format(ControllerName=form_controller_name, ViewName=form_view_name, Title=prefix.capitalize(), route=prefix.lower())
        create_file(form_view_path, form_view_content)
        print(f"Vista de formulario creada: {form_view_path}")

        # Actualizar el router con la vista de formulario
        update_router(form_view_name, prefix.lower(), form_controller_name)

if __name__ == "__main__":
    prefix = input("Ingrese el prefix del modelo, controlador y vista (ej. Product): ")
    create_view_controller_files(prefix)
    print(f"Archivos generados para el prefix '{prefix}'. Revisa las carpetas correspondientes.")
