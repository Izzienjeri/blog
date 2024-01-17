import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = ({handleClick}) => {
  const { categoryName } = useParams();
  const [categoryBlogs, setCategoryBlogs] = useState(null);

  useEffect(() => {
   
    fetch(`/categories/${categoryName}`)
      .then((resp) => resp.json())
      .then((data) => setCategoryBlogs(data));
  }, [categoryName]);

  return (
    <div className="category-page">
      <h2>{categoryName} Category</h2>
      {categoryBlogs ? (
        <ul>
          {categoryBlogs.map((blog) => (
            <li key={blog.id}>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <div className="image-container">
                {blog.images.map((image, index) => (
               <img key={index} className="blog-image" src={image.file_path} alt={`${index + 1}`} />
                 ))}
                </div>
              <div>
                    <button onClick={()=>handleClick(blog.id)}>Read More</button>
                </div>
                    
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CategoryPage;
