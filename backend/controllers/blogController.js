const Joi = require("joi");
const Blog = require("../models/blogSchema");
const blogSchema = require("../models/blogSchema");

const createBlog = async (req, res) => {
    
    // checking validation of data. Data is appropriate or not 
    const isValid = Joi.object({
        title: Joi.string().required(),
        textBody: Joi.string().min(10).max(1000).required()
    }).validate(req.body);

    //  If data is not valid then returning error
    if(isValid.error){
        return res.status(400).send({
            status: 400,
            message: "Invalid Input!",
            data: isValid.error
        })
    }

    const {title, textBody} = req.body;

    //  creating new blog to using Blog Schema
    const newBlog = new Blog({
        title,
        textBody,
        creationDateTime: new Date(),
        username: req.locals.username,
        userId: req.locals.userId
    })

    try {
        //  saving the data and retuning success call
        await newBlog.save();
        return res.status(201).send({
            status: 201,
            message: "Blog created successfully",
        })

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "Failed to create a blog!",
            data: err
        })
    }
}

//  getUserblogs  by user id from locals
const getUserBlog = async(req, res) => {
    const userId = req.locals.userId;
    const PAGE = Number(req.query.page) || 1;
    const LIMIT = 10;

    let blogData;

    try {
        blogData = await Blog.find({userId , isDeleted: false})
        .sort({creationDateTime: -1})
        .skip((PAGE - 1) * 10)
        .limit(LIMIT);

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "Unable to Fetch data!",
            data: err
        })
    }

    res.status(200).send({
        status: 200,
        message: "User Blogs fetched successfully.",
        data: blogData
    })
}

const deleteBlog = async(req, res) => {
    const blogId = req.params.blogid;
    const userId = req.locals.userId;

    let blogData;

    try {
        blogData = await Blog.findById(blogId);

        if(!blogData){
            return res.status(404).send({
                status: 404,
                message: "Blog data doesn't exist!",
            })
        }

        if(blogData.userId !== userId){
            return res.status(401).send({
                status: 401,
                message: 'Unauthorized to delete the blog, you are not the owner of the blog.',
            })
        }
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "Failed to fetched blog",
            data: err
        })
    }

    try {
        
        // await Blog.findByIdAndDelete(blogId);
        let blogObj = {
            isDeleted: true,
            deletionDateTime: Date.now()
        }
        await Blog.findByIdAndUpdate(blogId, blogObj)

        res.status(200).send({
            status: 200,
            message: "Blog deleted successfully."
        })

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "Failed to delete the blog.",
            data: err
        })
    }

}

// edit blog controller
const editBlog = async(req, res) => {
    const isValid = Joi.object({
        blogId: Joi.string().required(),
        title: Joi.string().required(),
        textBody: Joi.string().min(10).max(1000).required()
    }).validate(req.body);

    if(isValid.error){
        return res.status(400).send({
            status: 400,
            message: "Invalid field input!",
            data: isValid.error
        })
    }

    const {blogId, title, textBody} = req.body;
    const userId = req.locals.userId;

    let blogData;

    try {
        blogData = await Blog.findById(blogId);

        if(!blogData){
            return res.status(404).send({
                status: 404,
                message: "Blog data doesn't exist!",
            })
        }

        if(blogData.userId !== userId){
            return res.status(401).send({
                status: 401,
                message: 'Unauthorized to edit the blog, you are not the owner of the blog.',
            })
        }
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "Failed to fetched blog.",
            data: err
        })
    }

    const creationDateTime = blogData.creationDateTime;
    const currentTime = Date.now();

    const diff = (currentTime - creationDateTime)/(1000 * 60);

    if(diff > 30){
        return res.status(400).send({
            status: 400,
            message: "Exceeded the time to edit the blog, i.e., 30 mins.",
        })
    }

    try {
        await Blog.findByIdAndUpdate(blogId, {title, textBody});

        return res.status(200).send({
            status: 200,
            message: "Blog updated successfully.",
        })

    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: "Failed to update the blog.",
            data: err
        })
    }
}


//  homepageblogs controller
const getHomePageBlogs = async(req, res) => {
    const currentUserId = req.locals.userId;

    let followingList;

    try {
        // fetching data from FollowSchema of currentUser 
        followingList = await followSchema.find({currentUserId})

        if(followingList.length === 0){             // if current user doesnt follow anyone then shows error
            return res.status(400).send({
                status: 400,
                message: "Please follow users to display blogs."
            })
        }
    } catch (err) {
        return res.status(400).send({
            status:400,
            message: " Failed to fetch following list of blogs.",
            data: err
        })
    }

    //  filtering followingIds which user follows into an array

    let followingUserIds = []

    followingList.forEach((followObj) => {
        followingUserIds.push(followObj.followingUserId)
    });


    try {
        //  fetching the blogs of users which the current userFollows
        
        const homePageBlogs = await blogSchema.find({
            userId: {$in: followingUserIds}, isDeleted: false
        }).sort({creationDateTime: -1})

        return res.status(200).send({
            status: 200,
            message: "Fetched Following users data successfully.",
            data: homePageBlogs
        })
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: "Failed to fetch homepage blogs.",
            data: err
        })
    }
}

module.exports = { createBlog , getUserBlog, deleteBlog, editBlog, getHomePageBlogs}