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
    <div className="ui centered card "style={{ width: '700px', marginTop:"30px" }}>
      <h2>{categoryName} Category</h2>
      {categoryBlogs ? (
        <ul>
          {categoryBlogs.map((blog) => (
            <div key={blog.id} className='content'>
              <h3>{blog.title}</h3>
             
              <div className="ui Big centered image">
                {blog.images.map((image, index) => (
               <img key={index} className="blog-image" src={image.file_path} alt={`${index + 1}`} />
                 ))}
                </div>
                <p>{blog.excerpt}</p>
              <div>
                    <button onClick={()=>handleClick(blog.id)} className="mini ui teal button">Read More</button>
                </div>
                    
            </div>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CategoryPage;
