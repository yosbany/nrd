import os

# Función para leer las plantillas desde los archivos .template
def read_template(template_name):
    base_path = os.path.dirname(os.path.realpath(__file__))
    template_path = os.path.join(base_path, f"templates/{template_name}.template")
    with open(template_path, 'r') as file:
        return file.read()

# Leer las plantillas
controller_template = read_template("controller")
view_template = read_template("view")

# Función para actualizar RouteAppConfig.js con la vista creada
def update_router(ViewName, route):
    base_path = os.path.dirname(os.path.realpath(__file__))
    router_path = os.path.join(base_path, "../../app/config/RouteAppConfig.js")

    view_import_line = f"import {ViewName} from '../views/{ViewName}.js';\n"
    route_line = f'    "/{route}": {{ render: vnode => m(MainLayout, m({ViewName}, vnode.attrs)) }},\n'

    if os.path.exists(router_path):
        with open(router_path, 'r') as file:
            content = file.readlines()

        # Insertar la importación justo después de la última línea de importación existente
        last_import_index = next(i for i, line in enumerate(content) if not line.startswith("import"))
        content.insert(last_import_index, view_import_line)

        # Insertar la nueva ruta justo antes de la línea que contiene "};"
        for i, line in enumerate(content):
            if "};" in line:
                content.insert(i, route_line)
                break

        # Escribir los cambios en el archivo
        with open(router_path, 'w') as file:
            file.writelines(content)

        print(f"Ruta añadida a RouteAppConfig.js")
    else:
        print(f"Error: {router_path} no encontrado.")

# Función para actualizar MenuConfig.js
def update_menu(prefix):
    menu_line = f'    "{prefix.lower()}": {{ "label": "{prefix}s", "category": "Gestión", "pathRouter": "/{prefix.lower()}" }},\n'

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

# Función para crear vista y controlador
def create_view_controller_files(prefix):
    # Define nombres de archivo y ruta
    controller_name = f"{prefix}Controller"
    view_name = f"{prefix}View"

    # Rutas relativas basadas en la estructura de tu proyecto
    base_path = os.path.dirname(os.path.realpath(__file__))
    controller_path = os.path.join(base_path, f"../../app/controllers/{controller_name}.js")
    view_path = os.path.join(base_path, f"../../app/views/{view_name}.js")

    # Crear el controlador
    controller_content = controller_template.format(ControllerName=controller_name, ModelName=prefix, route=prefix.lower())
    create_file(controller_path, controller_content)
    print(f"Controlador creado: {controller_path}")

    # Crear la vista
    view_content = view_template.format(ControllerName=controller_name, ViewName=view_name, Title=prefix.capitalize(), route=prefix.lower())
    create_file(view_path, view_content)
    print(f"Vista creada: {view_path}")

    # Preguntar si se desea agregar la vista al router
    if prompt_user("¿Desea agregar la vista al router?"):
        update_router(view_name, prefix.lower())

    # Preguntar si se desea agregar la vista al menú
    if prompt_user("¿Desea agregar la vista al menú?"):
        update_menu(prefix)

if __name__ == "__main__":
    prefix = input("Ingrese el nombre de la vista y el controlador (ej. Report): ")
    create_view_controller_files(prefix)
    print(f"Archivos generados para '{prefix}'. Revisa las carpetas correspondientes.")
