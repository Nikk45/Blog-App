const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();

// files imports
const db = require('./config/db');
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const followRoute = require('./routes/follow');
const { cleanUpBin } = require('./utils/cron');

const PORT = process.env.PORT;

// middlewares
app.use(express.json());
app.use(cors({
    origin: '*'
}));

// routes
app.use('/user', userRoute);
app.use('/blog', blogRoute);
app.use('/follow', followRoute);

app.listen(PORT, ()=>{
    console.log("Server running at port: ", PORT);
    cleanUpBin();
});