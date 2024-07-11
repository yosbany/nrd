// views/UserList.js

import m from 'https://cdn.jsdelivr.net/npm/mithril/mithril.js';
import UserController from '../controllers/UserController';

const UserList = {
    oninit: UserController.UserList.oninit,
    view: UserController.UserList.view
};

export default UserList;
