//import ProfileController from './controllers/profile-controller.js';
import {getCurrentUserFirebase} from '../../../services/auth-service.js'
export default class ProfileController {
    constructor() {
        console.log('ProfileController constructor called');
         // Obtén referencias a elementos DOM relevantes
         const fullName = document.getElementById('fullName');
         const email = document.getElementById('email');
         const tokenMagerIO = document.getElementById('tokenMagerIO');
         let user = getCurrentUserFirebase();
         console.log(user);

    }
}
