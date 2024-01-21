import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {retrieve} from "../Encryption"

const ProfilePage = ({fetchBlogPosts}) => {
  const navigate = useNavigate();
  const [currentUser, setcurrentUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const user = retrieve()
    if (user) {
      setcurrentUser(user);
    } else {
      setcurrentUser(null);
    }

    fetch("/blogs")
      .then((resp) => resp.json())
      .then((blogs) => {
        console.log(blogs);
        setBlogs(
          blogs.filter((blog) => blog.user_id === user.user_id) || []
        );
        // fetchBlogPosts()
        
      })
      .catch((error) => {
        console.log("error fetching data", error);
      });
  }, []);

  function deletePost(myId) {
    const newBlogs = blogs.filter((blog)=>blog.id!==myId)
    fetch(`/blogs/${myId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization":"Bearer "+ retrieve().access_token
      },
    }).then(()=>{
     
      setBlogs(newBlogs)
      // fetchBlogPosts()
    
   
    })
  }

  return (
    <div>
      {currentUser ? (
        <div>
          <img src={currentUser.profile_image} alt="" />
          <h2>Welcome, {currentUser.username}!</h2>
          <p>User Details:</p>
         
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>

          <button onClick={(()=>navigate('/update_user'))}>Update User Details</button>
         

          <h3>Your Blogs:</h3>
          {blogs.length >= 1 ? (
            blogs.map((blog) => (
              <div key={blog.id}>
                <h4>{blog.title}</h4>
                <h6>{blog.excerpt}</h6>
                <p>{blog.content}</p>
                <div>
                <p>Categories:</p>
                 <ul>
                 {blog.categories.map((category) => category.name).join(', ')}
                </ul>
                </div>

                <div className="image-container">
                {blog.images.map((image, index) => (
               <img key={index} className="blog-image" src={image.file_path} alt={`${index + 1}`} />
                 ))}
                </div>
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
      <button onClick={()=>navigate("/add_post")}>Add a New Post</button>
    </div>
  );
};

export default ProfilePage;
