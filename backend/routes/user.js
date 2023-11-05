const express = require('express');
const { userRegister, userLogin } = require('../controllers/userController');

const app = express();

app.post('/register', userRegister);
app.post('/login', userLogin);


module.exports = app;