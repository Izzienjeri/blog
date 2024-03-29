import React, { useState, useEffect } from 'react';

const BlogCard = ({ blogPosts, handleClick }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (blogPosts.length === 0) {
    return <p>No blog posts available.</p>;
  }

  return (
    <div>
      <div className='posts'>
        {blogPosts?.map((blog) => (
          <div className='post' key={blog.id}>
            <div className='img'>
              {blog.images && blog.images.length > 0 && <img src={blog.images[0].file_path} alt="" />}
            </div>
            <div className='content'>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <div>
                <button onClick={() => handleClick(blog.id)}>Read More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCard;
