import React from "react";
import { useFormik } from "formik";
import { retrieve } from "../Encryption";

const AddComment = ({ blogPost, addComment }) => {
  const formik = useFormik({
    initialValues: {
      guest_name: retrieve().username,
      content: "",
      post_id: blogPost.id,
      user_id: retrieve().user_id,
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
    <div>
      <h2>Comment on the Post</h2>

      <form onSubmit={formik.handleSubmit}>
        <div className="add_comment">
          <label htmlFor="guest_name">Guest Name</label>
          <br />
          <input
            id="guest_name"
            name="guest_name"
            readOnly={true}
            onChange={formik.handleChange}
            value={formik.values.guest_name}
          />
          <label htmlFor="content">Comment</label>
          <br />
          <input
            id="content"
            name="content"
            onChange={formik.handleChange}
            value={formik.values.content}
          />
        </div>

        <button type="submit">Submit your Comment</button>
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
