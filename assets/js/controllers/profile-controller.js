import BaseController from './base-controller.js';

export default class ProfileController extends BaseController {
    constructor() {
        super();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async profile() {
        console.log("ProfileController profile");
    }
    
    async __profile() {
        // Obtén referencias a elementos DOM relevantes
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const tokenMagerIO = document.getElementById('tokenMagerIO');
        let user = getCurrentUserFirebase();
        console.log(user);
    }
}
