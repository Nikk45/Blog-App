const Joi = require("joi");
const userSchema = require("../models/userSchema");
const followSchema = require("../models/followSchema");

const followUser = async (req, res) => {
    const currentUserId = req.locals.userId;
    const {followingUserId} = req.body;

    const isValid = Joi.object({
        followingUserId: Joi.string().required(),
    }).validate(req.body);

    if(isValid.error){
        return res.status(400).send({
            status: 400,
            message: "Invalid UserId.",
            data: isValid.error
        })
    }

    //  verifying the followingUserId exists or not

    let followingUserData;

    try {
        followingUserData = await userSchema.findById(followingUserId);

        if(!followingUserData){
            return res.status(400).send({
                status: 400,
                message: "User doesn't exist."
            })
        }
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: "Failed to fetch user data.",
            data: err
        })
    }

    //  checking if the Currentuser already follows the other user or not
    try {
        let followData = await followSchema.findOne({currentUserId, followingUserId});

        if(followData){
            return res.status(400).send({
                status: 400,
                message: "User Already Follows.",
            })
        }
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: "Failed to fetch follow data.",
            data: err
        })
    }

    const followObj = new followSchema({
        currentUserId,
        followingUserId,
        creationDateTime: Date.now()
    })

    try {
        await followObj.save();

        return res.status(201).send({
            status:201,
            message: "User Followed Successfully."
        })
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: " Failed to follow the user.",
            data: err
        })
    }
}

const unfollowUser = async (req, res) => {
    const currentUserId = req.locals.userId;
    const { followingUserId } = req.body;
  
    const isValid = Joi.object({
      followingUserId: Joi.string().required(),
    }).validate(req.body);
  
    if (isValid.error) {
      return res.status(400).send({
        status: 400,
        message: "Invalid UserId",
        data: isValid.error,
      });
    }
  
    // Verify the following userId
    let followingUserData;
    try {
      followingUserData = await userSchema.findById(followingUserId);
  
      if (!followingUserData) {
        return res.status(400).send({
          status: 400,
          message: "User doesn't exists",
        });
      }
    } catch (err) {
      return res.status(400).send({
        status: 400,
        message: "Failed to fetch user data",
        data: err,
      });
    }
  
    // Check if the currentUser already follows the followingUser
    try {
      const followObj = await followSchema.findOne({ currentUserId, followingUserId });
  
      if (!followObj) {
        return res.status(400).send({
          status: 400,
          message: "You don't follow this user",
        });
      }
    } catch (err) {
      return res.status(400).send({
        status: 400,
        message: "Failed to fetch follow object",
        data: err,
      });
    }
  
    try {
      await followSchema.findOneAndDelete({ currentUserId, followingUserId });
  
      return res.status(200).send({
        status: 200,
        message: "Unfollowed successfully",
      });
    } catch (err) {
      return res.status(400).send({
        status: 400,
        message: "Failed to unfollow user",
        data: err,
      });
    }
  };
  

module.exports = {followUser, unfollowUser}