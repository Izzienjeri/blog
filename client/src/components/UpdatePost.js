import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
  const navigate = useNavigate();
  const {id}=useParams()
  const user = localStorage.getItem("user")
  const [updatedPost, setUpdatedPost] = useState({
    title: "",
    excerpt: "",
    content: "",
  });

  useEffect(()=>{
    fetch("/blogs")
      .then((resp) => resp.json())
      .then((blogs) => {
        const userBlog = blogs.find((blog) => blog.user_id === JSON.parse(user).id)
        setUpdatedPost({
            title:userBlog.title,
            excerpt:userBlog.excerpt,
            content:userBlog.content
        })
      })
      .catch((error) => {
        console.log("error fetching data", error);
      });
  },[])

  const handleEditClick = () => {
    fetch(`/blogs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    })
      .then((resp) => resp.json())
      .then(() => {
        setUpdatedPost({
          title: "",
          excerpt: "",
          content: "",
        });
        navigate("/profile_page");
      })
      .catch((error) => {
        console.error("Error updating post:", error);
      });
  };

  return (
    <div className="edit_post">
      <label>Title</label>
      <textarea
        id="title"
        name="title"
        rows="10"
        cols="30"
        value={updatedPost.title}
        onChange={(e) =>
          setUpdatedPost({ ...updatedPost, title: e.target.value })
        }
      ></textarea>
      <label>Excerpt</label>
      <textarea
        id="excerpt"
        name="excerpt"
        rows="10"
        cols="30"
        value={updatedPost.excerpt}
        onChange={(e) =>
          setUpdatedPost({ ...updatedPost, excerpt: e.target.value })
        }
      ></textarea>
      <label>Content</label>
      <textarea
        id="content"
        name="content"
        rows="10"
        cols="30"
        value={updatedPost.content}
        onChange={(e) =>
          setUpdatedPost({ ...updatedPost, content: e.target.value })
        }
      ></textarea>
      <button onClick={() => handleEditClick()}>Save</button>
    </div>
  );
};

export default UpdatePost;
