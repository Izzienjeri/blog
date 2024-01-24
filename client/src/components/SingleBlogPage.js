import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddComment from "./AddComment";
import { retrieve } from "../Encryption";

const SingleBlogPage = ({ handleComment }) => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [myComment, setMyComment] = useState(null);
  const [comments, setComments] = useState([]);
  const [isOpen, setIsOpen] = useState({ id: null, open: false });

  useEffect(() => {
    handleFetchBlogs();
  }, []);

  const handleFetchBlogs = () => {
    fetch(`/blogs/${id}`)
      .then((resp) => resp.json())
      .then((blog) => {
        console.log("BLOGCOM: ", blog.comments);
        setBlogPost(blog);
        setComments(blog.comments);
      })
      .catch((error) => {
        console.log("error fetching blog post", error);
      });
  };

  const handleUpdateComment = (commentId) => {
    fetch(`/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${retrieve().access_token}`,
      },
      body: JSON.stringify({ content: myComment }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("DATTA: ", data);
        setIsOpen({ id: commentId, open: false });
        handleFetchBlogs();
        console.log(data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const addComment = (values) => {
    fetch("/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + retrieve().access_token,
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit comment");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Comment submitted successfully:", data);
        handleFetchBlogs();
      })
      .catch((error) => {
        console.error("Error submitting comment:", error);
      });
  };

  const deleteComment = (commentId) => {
    fetch(`/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${retrieve().access_token}`,
      },
    })
      .then((res) => {
        console.log("RES: ", res);
        handleFetchBlogs();
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  };

  if (!blogPost) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ui grid">
      <div className="ui centered card" style={{ width: '900px',marginTop:'20px' }}>
      <div className="ui content">
      <h2>{blogPost.title}</h2>

      <div className="image-container">
        {blogPost.images.map((image, index) => (
          <img
            key={index}
            className="ui medium centered image"
            src={image.file_path}
            alt={`${index + 1}`}
          />
        ))}
      </div>

      <div>
        <p>{blogPost.content}</p>
      </div>

      <div className="ui centered card"style={{ width: '500px', marginTop:"30px" }}>
        <h2>Comments</h2>
        {blogPost.comments.length >= 1 && retrieve() ? (
          blogPost.comments.map((comment, index) => (
            <div key={index} style={{ marginBottom:'20px'}}>
              Guest Name:{comment.guest_name}:
              
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  justifyContent: "center",
                }}
              >
                <p>{comment.content}</p>
                {comment.user_id === retrieve().user_id ? (
                  <>
                    <button
                     className="mini ui teal button"
                     style={{ marginBottom:'20px', marginTop:'20px'}}
                      onClick={() =>
                        setIsOpen((val) => {
                          if (!val.open) {
                            setMyComment(comment.content);
                            return { ...val, id: comment.id, open: !val.open };
                          }
                        })
                      }
                    >
                      Update
                    </button>
                    <button onClick={() => deleteComment(comment.id)} className="mini ui teal button" style={{ marginBottom:'20px', marginTop:'20px'}}>
                      Delete
                    </button>
                  </>
                ) : (
                  ""
                )}
                {isOpen.id === comment.id && isOpen.open ? (
                  <div>
                    <input
                      id="newComment"
                      name="newComment"
                      value={myComment}
                      onChange={(e) => setMyComment(e.target.value)}
                    />
                    <button onClick={() => handleUpdateComment(comment.id)}>
                      Save
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No Post Comments</p>
        )}
     

      
      </div>
      <div>
        <AddComment
          handleComment={handleComment}
          blogPost={blogPost}
          addComment={addComment}
        />
      </div>
      </div>
    </div>
    </div>
  );
};

export default SingleBlogPage;
