import BaseController from './base-controller.js';
import BudgetLunchView from '../views/budget-lunch-view.js';

export default class BudgetLunchController extends BaseController {
    constructor() {
        super();
        this.view = new BudgetLunchView();
        this.initEventsController();
    }

    initEventsController(){
        
    }

    async budgetLunch() {
        console.log("BudgetLunchController budgetLunch");
        this.view.renderView();
    }
}
