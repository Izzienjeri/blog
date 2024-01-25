import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { retrieve, store } from "../Encryption";
import AddCategory from "./AddCategory";
import 'semantic-ui-css/semantic.min.css';

const AddPost = ({ blogPosts,setBlogPosts, fetchBlogPosts }) => {
  const [fileUpload, setFileUpload] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoryShown,setCategoryShown]=useState(false)

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      excerpt: "",
      content: "",
      category: selectedCategory,
    },
    onSubmit: (values, { resetForm }) => {
      if (fileUpload) {
        const data = values;

        console.log("FD: ", data);
        postBlog(data);
        resetForm();
      } else {
        alert("Please include an image to upload");
      }
    },
  });

  useEffect(() => {
    categoryData();
  }, []);

  function postBlog(data) {
    fetch("/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + retrieve().access_token,
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("DATA: ", data);
        setBlogPosts(data);
        console.log(data)
       
        const id = data.id;
        const formData = new FormData();
        formData.append("file", fileUpload);
        formData.append("description", "");

        fetch(`/upload/${id}`, {
          method: "POST",
          headers: { Authorization: "Bearer " + retrieve().access_token },
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          setImage(data)
         
            navigate("/profile_page");

            
          });
      
       
      });
  }

  const handleChange = (e) => {
    const file = e.target.files[0];
    setFileUpload(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImage(reader.result);
      console.log(image);
    };
  };

  function categoryData() {
    fetch("/categories")
      .then((resp) => resp.json())
      .then((data) => setCategories(data));
  }

 

  return (
    <div className="ui grid">
    
      <div className="eight wide column" style={{ marginTop: '20px' }}>
        <h2>Add Category</h2>
        <div className="ui segment">
          <div>
            <button className="ui teal button"  onClick={() => setCategoryShown(true)}>
              Add New Category
            </button>
          </div>
          {categoryShown ? <AddCategory setCategories={setCategories} categories={categories} /> : ""}
        </div>
      </div>
  
   
      <div className="eight wide column" style={{ marginTop: '20px' }}>
        <h2>Add Post</h2>
        <div className="ui segment">
        <form onSubmit={formik.handleSubmit}>
    
      <div className="form-group">
        <label htmlFor="category" className="label_blog">Category</label>
        <select
          name="category"
          id="category"
          value={formik.values.category}
          onChange={(e) => {
            formik.handleChange(e);
            setSelectedCategory(e.target.value);
          }}
        >
          <option value="Select Category">Select Category</option>
          {categories &&
            categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

   
      <div className="form-group">
        <label htmlFor="title" className="label_blog">Blog Title</label>
        <input className="title_blog"
          id="title"
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title}
        />
      </div>

      <div className="form-group">
        <label htmlFor="excerpt"  className="label_blog">Blog Excerpt</label>
        <textarea className="textarea"
          id="excerpt"
          name="excerpt"
          onChange={formik.handleChange}
          value={formik.values.excerpt}
        />
      </div>

   
      <div className="form-group">
        <label htmlFor="content"  className="label_blog">Blog Post</label>
        <textarea className="textarea"
          id="content"
          name="content"
          onChange={formik.handleChange}
          value={formik.values.content}
        />
      </div>

    
      <div className="form-group">
        <label htmlFor="fileInput" className="label_blog">Upload Photo Here</label>
        <input
          type="file"
          id="file"
          onChange={(e) => handleChange(e)}
          required
          accept="image/png,image/jpeg,image/jpg,image/jfif"
        />
        <img src={image} alt="" className="ui medium centered image"/>
      </div>

    
      <div className="form-group">
        <button className="ui teal button" type="submit">
          Save New Post
        </button>
      </div>
    </form>
        </div>
      </div>
    </div>
  );
  
};

export default AddPost;