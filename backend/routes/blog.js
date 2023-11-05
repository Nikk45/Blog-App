const express = require('express');
const { createBlog, getUserBlog, deleteBlog, editBlog, getHomePageBlogs } = require('../controllers/blogController');
const { isAuth } = require('../middlewares/authMiddleware');
const app = express();

app.post('/create-blog', isAuth, createBlog);
app.get('/get-user-blogs', isAuth, getUserBlog)
app.delete('/delete-blog/:blogid', isAuth, deleteBlog)
app.put('/edit-blog', isAuth, editBlog)
app.get('/homepage-blogs', isAuth, getHomePageBlogs)

module.exports =  app; 