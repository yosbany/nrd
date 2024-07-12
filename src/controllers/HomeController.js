import HomeView from '../views/HomeView.js';

const HomeController = {
    home: () => {
        return {
            view: () => m(HomeView)
        };
    }
};

export default HomeController;
