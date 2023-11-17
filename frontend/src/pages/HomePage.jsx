import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogCard from "../components/Blogs/BlogCard";

function Homepage() {
  const [homepageBlogs, setHomepageBlogs] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/blog/homepage-blogs`, {
          headers: {
            "project-blog": token,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setHomepageBlogs(res.data.data);
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
    <div className="homepage">
      <h1 className="homepage-heading">Homepage</h1>
      {
        homepageBlogs? (
            homepageBlogs.map((blog, i) => (
                <BlogCard key={i} blogData={blog} homepage={true} />
            ))
        ) : <p className="homepage-error">Blogs not found. Please follow users to get Blogs.</p>
      }
    </div>
  );
}

export default Homepage;