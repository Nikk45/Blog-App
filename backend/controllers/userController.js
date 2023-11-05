const Joi = require('joi');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const bcryptSalts = Number(process.env.BCRYPT_SALTS);

//  UserRegister controller
const userRegister = async(req,res)=>{

    // checking validation of data
    const isValid = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().min(3).max(25).alphanum().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    }).validate(req.body);

    if(isValid.error){                      // If data is not valid showing error
        return res.status(400).send({
            status: 400,
            message: "Invalid Input",
            data: isValid.error
        })
    }

    try {
        const isExists = await User.find({                  //   checking if data already exists in DB or not 
            $or: [{email: req.body.email, username: req.body.username}]
        });
        
        if(isExists.length!==0){                       // if data exists then showing error 
            return res.status(400).send({
                status:400,
                message: "Username/Email Already Exists"
            })
        }
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "Error while checking username and email",
            data: err
        })
    }

    //  hash function is used to convert the password into encrypted password
    
    const hashedPassword = await bcrypt.hash(req.body.password, bcryptSalts);

    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        await newUser.save();

        return res.status(201).send({
            status: 201,
            message: "User registered successfully"
        })

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "User Register Failed!",
            data: err
        })
    }
}

// UserLogin controller
const userLogin = async(req, res)=>{

    const {username, password} = req.body;

    const isValid = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    }).validate(req.body)

    if(isValid.error){
        return res.status(400).send({
            status: 400,
            message: "Invalid Username/Password",
            data: isValid.error
        })
    }

    let userData;

    try {  
        userData = await User.findOne({username});     // finding user data in DB 

        if(!userData){                              // if data is not there in DB showing not found user
            return res.status(400).send({
                status: 400,
                message: "User Not Found! Please register."
            })
        }
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "Database fetching error!"
        })
    }

// Compare function helps to check is the login password and encrypted password same or not

    const isPasswordSame = await bcrypt.compare(password, userData.password)

    if(!isPasswordSame){             // if password not same  then showing error
        return res.status(400).send({
            status: 400,
            message: "Incorrect Password!"
        })
    }

    const payload = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        userId: userData._id,
    }

    //  sign function helps to convert payload and private key into token 
    // later this token is converted into the above payload in Authencation

    const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);

    return res.status(200).send({
        status:200,
        message: "User Login Successful",
        data: { token }
    })
}


module.exports = {userRegister, userLogin}