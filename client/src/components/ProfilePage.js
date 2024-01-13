import React, { useEffect, useState } from 'react';


const ProfilePage = ({blogPosts }) => {
const [currentUser,setcurrentUser]=useState(null)
const [blogs,setBlogs]=useState([])
useEffect(()=>{
    console.log(blogPosts)
    const user=localStorage.getItem("user")
    if (user){
        setcurrentUser(JSON.parse(user))
        setBlogs(blogPosts.filter((blog) => blog.user_id === JSON.parse(user).id))
    }
    else{setcurrentUser(null)}



},[])
 
  
  console.log(currentUser)
  

  return (
    <div>
        {currentUser?<div>
        <h2>Welcome, {currentUser.username}!</h2>
        <p>User Details:</p>
        <p>Username: {currentUser.username}</p>
        <p>Email: {currentUser.email}</p>
        <button>Update Password</button>

        <h3>Your Blogs:</h3>
        {blogs.length>1?blogs.map((blog) => (
          <div key={blog.id}>
            <h4>{blog.title}</h4>
            <h6>{blog.excerpt}</h6>
            <p>{blog.content}</p>
            <button>Update</button>
            <button>Delete</button>
          </div>
        )):<p>No existing Blogs</p>}
      </div>:<div></div>}
      <button>Add a New Post</button>

      
    </div>
  );
};

export default ProfilePage;
