import BaseController from './base-controller.js';
import HomeView from '../views/home-view.js';
import FirebaseServiceInstance from '../../../services/firebase-service.js';

export default class HomeController extends BaseController {

    constructor() {
        super();
        this.view = new HomeView();
        this.initEventsController();
    }

    initEventsController() {

    }

    async init() {
        console.log("HomeController init");
        this.view.renderView();
    }
x
    async home() {
        console.log("HomeController home");
        this.view.renderView();
        const userData = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            age: 31
        };
        console.log("userData: ", userData);
        this.authenticateUser('nriodor@gmail.com', 'NuevaR1oDor..');
        this.writeDataToDatabase('users/johndoe', userData);
        this.readDataFromDatabase('users/johndoe');
    }

    exit() {
        console.log("HomeController exit");
        FirebaseServiceInstance.logout();
        this.redirectToPage("login.html");
    }


    // Ejemplo de autenticación de usuario
    async authenticateUser(email, password) {
        try {
            const user = await FirebaseServiceInstance.login(email, password);
            console.log('Usuario autenticado:', user);
        } catch (error) {
            console.error('Error al autenticar usuario:', error.message);
        }
    }

    // Ejemplo de escritura de datos en la base de datos en tiempo real
    async writeDataToDatabase(path, data) {
        try {
            await FirebaseServiceInstance.writeData(path, data);
            console.log('Datos escritos en la base de datos:', data);
        } catch (error) {
            console.error('Error al escribir datos en la base de datos:', error.message);
        }
    }
    async readDataFromDatabase(path) {
        try {
            const data = await FirebaseServiceInstance.readData(path);
            console.log('Datos leídos desde la base de datos:', data);
        } catch (error) {
            console.error('Error al leer datos desde la base de datos:', error.message);
        }
    }
}