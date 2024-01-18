import React from 'react'
import { useFormik } from "formik";

const AddComment = ({handleComment}) => {

    const formik = useFormik({
        initialValues: {
          guest_name: "",
          content: "",
          
        },
        onSubmit: (values, { resetForm }) => {
            handleComment(values)
            resetForm()
         
        },
      });
  return (
    <div>
        <div>
      <h2>Comment on the Post</h2>

      <form onSubmit={formik.handleSubmit}>
      <div className="add_comment">
      <label htmlFor="name">Guest Name</label>
        <br />
        <input
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
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
      
    </div>
  )
}

export default AddComment
