const jwt = require('jsonwebtoken');

const isAuth = (req, res, next)=>{
    const token = req.headers["project-blog"];

    let isverified;

    //  verify function is used to verify if the token provided is valid or not
    try {
        isverified = jwt.verify(token, process.env.JWT_PRIVATE_KEY);         // if valid then returns the payload of the user(data of user)
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: "JWT not provided. Please login!",
            data: err
        })
    }

    if(isverified){                              // req.locals if like store space used while authentication to store the data
        req.locals = isverified;                 // each api call has its own locals and when lifecycle of API ends locals also ends
        next();                                // used to call controller or other middleware if provided
    }else{
        return res.status(401).send({
            status: 401,
            message: "User not Authorized. Please Login!",
            data: err
        })
    }
}

module.exports = { isAuth }