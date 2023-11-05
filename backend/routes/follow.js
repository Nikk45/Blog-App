const express = require('express');
const { isAuth } = require('../middlewares/authMiddleware');
const { followUser, unfollowUser } = require('../controllers/followController');
const app = express();

app.post('/follow-user', isAuth, followUser);
app.post('/unfollow-user', isAuth, unfollowUser);

module.exports =  app; 