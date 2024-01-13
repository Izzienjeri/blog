import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SingleBlogPage = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);

  useEffect(() => {
    fetch(`/blogs/${id}`)
      .then((resp) => resp.json())
      .then((blog) => {
        setBlogPost(blog);
      })
      .catch((error) => {
        console.log('error fetching blog post', error);
      });
  }, [id]);

  if (!blogPost) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{blogPost.title}</h2>
      
    
      <div className="image-container">
        {blogPost.images.map((image, index) => (
          <img key={index} className="blog-image" src={image.file_path} alt={`${index + 1}`} />
        ))}
      </div>
      
      <p>{blogPost.content}</p>
    </div>
  );
};

export default SingleBlogPage;
