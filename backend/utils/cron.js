const cron = require('node-cron');
const blogSchema = require('../models/blogSchema');

const cleanUpBin = () => {
    cron.schedule("0 0 1 * * *", async() => {

        console.log("cron is running");

        const deletedBlogs = await blogSchema.find({isDeleted: true});

        if(deletedBlogs.length > 0){
            deletedBlogs.forEach(async (blog) => { 
                const diff = (blog.deletionDateTime - blog.creationDateTime) / (1000 * 60 * 60 * 24);

                if(diff >= 30){
                    try {
                        await blogSchema.findByIdAndDelete(blog._id);
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        }
    },
    {
        scheduled: true,
        timezone: "Asia/Kolkata"
    }
    )
}

module.exports = { cleanUpBin }