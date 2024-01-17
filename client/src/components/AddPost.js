import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const AddPost = ({ setPosts, fetchBlogPosts }) => {
  const [fileUpload, setFileUpload] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      excerpt: "",
      content: "",
      category:selectedCategory,
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
      },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setPosts(data);
        console.log("DATA: ", data);
        const id = data.id;
        const formData = new FormData();
        formData.append("file", fileUpload);
        formData.append("description", "");

        fetch(`/upload/${id}`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
        navigate("/profile_page");
        fetchBlogPosts();
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
    <div>
      <h2>Add Post</h2>

      <form onSubmit={formik.handleSubmit}>
      <div className="filter">
      <select
  name="category"
  value={formik.values.category}
  onChange={(e) => {
    formik.handleChange(e);
    setSelectedCategory(e.target.value);
  }}
>

          
            <option value="Select Category" disabled>
              Select Category
            </option>
            {categories && 
              categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <label htmlFor="title">Blog Title</label>
        <br />
        <input
          id="title"
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        <label htmlFor="excerpt">Blog Excerpt</label>
        <br />
        <input
          id="excerpt"
          name="excerpt"
          onChange={formik.handleChange}
          value={formik.values.excerpt}
        />
        <label htmlFor="content">Blog Post</label>
        <br />
        <input
          id="content"
          name="content"
          onChange={formik.handleChange}
          value={formik.values.content}
        />
        <br />
        <label htmlFor="fileInput">Upload Photo Here</label>
        <input
          type="file"
          id="file"
          onChange={(e) => handleChange(e)}
          required
          accept="image/png,image/jpeg,image/jpg,image/jfif"
        />
        <img src={image} alt="" />

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddPost;