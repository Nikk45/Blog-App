import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogCard from "../components/Blogs/BlogCard";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/blog/get-user-blogs`, {
          headers: {
            "project-blog": token,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            setMyBlogs(res.data.data);
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);

  return (
    <div className="my-blogs-page">
      <h1 className="myblog-heading">My Blogs</h1>
      {
        myBlogs.length > 0 ? (myBlogs.map((blog) => (
            <BlogCard blogData={blog} />
        ))) : (<p className="my-blogs-error">No Blogs Found. Please Create Blogs</p>)
      }
    </div>
  );
}

export default MyBlogs;