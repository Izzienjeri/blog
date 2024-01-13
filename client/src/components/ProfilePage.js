import React from 'react';
import { useLocation } from 'react-router-dom';

const ProfilePage = ({ blogPosts}) => {
 
  const user=useLocation().state
  console.log(user)
  
  const blogs = blogPosts.filter((blog) => blog.userId === user.id);

  return (
    <div>
      <div>
        <h2>Welcome, {user.username}!</h2>
        <p>User Details:</p>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>

        <h3>Your Blogs:</h3>
        {blogs.map((blog) => (
          <div key={blog.id}>
            <h4>{blog.title}</h4>
            <p>{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
