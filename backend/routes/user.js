const express = require('express');
const { userRegister, userLogin, getAllUsers } = require('../controllers/userController');
const { isAuth } = require('../middlewares/authMiddleware');

const app = express();

app.post('/register', userRegister);
app.post('/login', userLogin);
app.get("/get-all-users", isAuth, getAllUsers);

module.exports = app;