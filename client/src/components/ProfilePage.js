import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [currentUser, setcurrentUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setcurrentUser(JSON.parse(user));
    } else {
      setcurrentUser(null);
    }

    fetch("/blogs")
      .then((resp) => resp.json())
      .then((blogs) => {
        console.log(blogs);
        setBlogs(
          blogs.filter((blog) => blog.user_id === JSON.parse(user).id) || []
        );
      })
      .catch((error) => {
        console.log("error fetching data", error);
      });
  }, []);

  function deletePost(myId) {
    const newBlogs = blogs.filter(blog=>blog.id!==myId)
    fetch(`/blogs/${myId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(()=>{
     
      setBlogs(newBlogs)
    })
  }

  return (
    <div>
      {currentUser ? (
        <div>
          <h2>Welcome, {currentUser.username}!</h2>
          <p>User Details:</p>
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>
          <button>Update Password</button>

          <h3>Your Blogs:</h3>
          {blogs.length > 1 ? (
            blogs.map((blog) => (
              <div key={blog.id}>
                <h4>{blog.title}</h4>
                <h6>{blog.excerpt}</h6>
                <p>{blog.content}</p>
                <button onClick={() => navigate(`/update_blog/${blog.id}`)}>
                  Update
                </button>
                <button onClick={()=>deletePost(blog.id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No existing Blogs</p>
          )}
        </div>
      ) : (
        <div></div>
      )}
      <button>Add a New Post</button>
    </div>
  );
};

export default ProfilePage;
