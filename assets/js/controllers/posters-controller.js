import BaseController from './base-controller.js';

export default class PostersController extends BaseController {
    constructor() {
        super();
    }

    async posters() {
        console.log("PostersController posters");
    }
}
