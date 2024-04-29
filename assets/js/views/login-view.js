import BaseView from './base-view.js';

export default class LoginView  extends BaseView {
    constructor() {
        super();
    }

    render() {
        console.log("LoginView render");
        this.redirectTo("login.html");
    }
}