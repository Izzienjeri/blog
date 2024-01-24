import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {retrieve} from "../Encryption";
import 'semantic-ui-css/semantic.min.css';

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
     
    
   
    })
  }

  return (
    <div className="ui grid" style={{ marginTop: '20px' }}>
      {currentUser ? (
        <div className="five wide column">
          <div className="ui centered card">
            <div>
              <div className="ui small circular image">
                <img src={currentUser.profile_image} alt="" />
              </div>
              <h2>Welcome, {currentUser.username}!</h2>
             
              <p>Username: {currentUser.username}</p>
              <p>Full Name: {currentUser.firstname} {currentUser.lastname}</p>
              <p>Email: {currentUser.email}</p>
            </div>
            <div>
              <button className="ui teal button" style={{ marginTop: '20px',marginBottom:'20px' }}onClick={() => navigate('/update_user')}>
                Update User Details
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <div className="ten wide column">
        <div className="ui fluid card">
          <div className="content">
        <h3 className="ui center aligned header">Your Blogs:</h3>
        {blogs.length >= 1 ? (
          blogs?.map((blog) => (
            <div className="ui centered card" key={blog.id}  style={{ width: '900px' }}>
              <div  className="content">
              <div className="image-container">
                {blog?.images.map((image, index) => (
                  <img key={index} className="ui small centered image" src={image.file_path} alt={`${index + 1}`} />
                ))}
                </div>
              <h4>{blog.title}</h4>
              <h6>{blog.excerpt}</h6>
              <p>{blog.content}</p>
              <div>
                <p>Categories:</p>
                <ul>
                  {blog?.categories.map((category) => category.name).join(', ')}
                </ul>
              </div>

             

              <button className="mini ui teal button" onClick={() => navigate(`/update_blog/${blog.id}`)}>
                Update
              </button>
              <button  className="mini ui teal button" onClick={() => deletePost(blog.id)}>Delete</button>
              </div>
            </div>
          ))
          
        ) : (
          <p>No existing Blogs</p>
          
        )}
          <button className="ui teal button" onClick={() => navigate("/add_post")}>Add a New Post</button>
      </div>
      </div>

      </div>
    </div>
  );
};

export default ProfilePage;