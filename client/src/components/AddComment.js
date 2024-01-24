import React from "react";
import { useFormik } from "formik";
import { retrieve } from "../Encryption";

const AddComment = ({ blogPost, addComment }) => {
  const formik = useFormik({
    initialValues: {
      guest_name: retrieve() ? retrieve().username || retrieve().firstname:"",
      content: "",
      post_id: blogPost.id,
      user_id:retrieve() ? retrieve().user_id:""
    },
    onSubmit: (values, { resetForm }) => {
      try {
        const encryptedData = localStorage.getItem("jwt");

        if (encryptedData) {
          addComment(values);
        } else {
        }

        resetForm();
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    },
  });

  return retrieve() !== null ? (
    <div className="ui centered card" style={{ marginTop:'20px' ,width:"500px"}}>
      <h3>Comment on the Post</h3>

      <form onSubmit={formik.handleSubmit}>
        <div className="add_comment"style={{ marginBottom:'20px', marginTop:'20px'}}>
          <label htmlFor="guest_name" className="label_blog" >Guest Name</label>
          <br />
          <input
          className="normal-inputs"
            id="guest_name"
            name="guest_name"
            readOnly={true}
            onChange={formik.handleChange}
            value={formik.values.guest_name}
          />
          <br/>
          <label htmlFor="content" className="label_blog">Comment</label>
          <br />
          <input
           className="normal-inputs2"
           style={{ marginTop:'20px'}}
            id="content"
            name="content"
            onChange={formik.handleChange}
            value={formik.values.content}
          />
        </div>

        <button type="submit"  className="mini ui teal button" style={{ marginBottom:'20px', marginTop:'20px'}}>Submit your Comment</button>
      </form>
    </div>
  ) : (
    <p>
      Please <a href="/signIn">login</a> or <a href="/register">signup</a> to
      comment
    </p>
  );
};

export default AddComment;
