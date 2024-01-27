import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { retrieve } from "../Encryption";


const UpdatePost = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const[ categories,setCategories]=useState(null)
  const [fileUpload, setFileUpload] = useState(null);
  const [image, setImage] = useState(null);
  const {id}=useParams()
  const user = retrieve()
  const [updatedPost, setUpdatedPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    category:selectedCategory
   
  });

  useEffect(()=>{
    fetch(`https://blog-mxao.onrender.com/blogs/${id}`)
      .then((resp) => resp.json())
      .then((blog) => {
       console.log(blog)
        setUpdatedPost({
            title:blog.title,
            excerpt:blog.excerpt,
            content:blog.content,
            // category:blog.categories
        })
      categoryData()
      })
      .catch((error) => {
        console.log("error fetching data", error);
      });
  },[])

  const handleEditClick = () => {
    fetch(`https://blog-mxao.onrender.com/blogs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization":"Bearer "+ retrieve().access_token
      },
      body: JSON.stringify(updatedPost),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data)
       if (fileUpload){       
        const blogId=data.id
        const formData = new FormData();
        formData.append("file", fileUpload);
        formData.append("description", "");
      
        fetch(`https://blog-mxao.onrender.com/upload/${blogId}`, {
          method: "POST",
          headers:{"Authorization": "Bearer " + retrieve().access_token},
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            navigate("/profile_page")
          });
       }
       navigate("/profile_page")

      })
      .catch((error) => {
        console.error("Error updating post:", error);
      });
  };
  function categoryData() {
    fetch("https://blog-mxao.onrender.com/categories") 
      .then((resp) => resp.json())
      .then((data) => setCategories(data));
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
 
  

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:"50px" }}>
      
      <div className="ui card form-container" style={{ width: '350px' }}>
      <h2>Update Post</h2>
        <div className="content">
          <div className="form-details-container">
            <label>Blog Title</label>
            <textarea
              id="title"
              name="title"
              rows="10"
              cols="30"
              value={updatedPost.title}
              onChange={(e) => setUpdatedPost({ ...updatedPost, title: e.target.value })}
            ></textarea>
          </div>
          <div className="form-details-container">
            <label> Blog Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="10"
              cols="30"
              value={updatedPost.excerpt}
              onChange={(e) => setUpdatedPost({ ...updatedPost, excerpt: e.target.value })}
            ></textarea>
          </div>
          <div className="form-details-container">
            <label> Blog Content</label>
            <textarea
              id="content"
              name="content"
              rows="10"
              cols="30"
              value={updatedPost.content}
              onChange={(e) => setUpdatedPost({ ...updatedPost, content: e.target.value })}
            ></textarea>
          </div>
          {/* <div>
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
           
          </div> */}
          <div><button onClick={() => handleEditClick()} className="mini ui teal button">Save</button></div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;


