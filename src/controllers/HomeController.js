import HomeView from '../views/HomeView.js';

const HomeController = {
    home: () => {
        return m(HomeView);
    }
};

export default HomeController;
