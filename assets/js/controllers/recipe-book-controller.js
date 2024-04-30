import BaseController from './base-controller.js';
import RecipeBookView from '../views/recipe-book-view.js';

export default class RecipeBookController extends BaseController {
    constructor() {
        super();
        this.view = new RecipeBookView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async recipeBook() {
        console.log("RecipeBookController recipeBook");
        this.view.renderView();
    }

    
}
