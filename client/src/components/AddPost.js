import { useFormik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'


const AddPost = ({addPost}) => {
   const navigate=useNavigate()
    const formik=useFormik({
        initialValues:{
            title:"",
            excerpt:"",
            content:"",
            images:"",
        },
    onSubmit: (values, { resetForm }) => {
        addPost(values)
        resetForm()
        navigate("/profile_page")
    
          

    }})

  return (
    <div>
        <h2>Add Post</h2>
       
        <form onSubmit={formik.handleSubmit}>

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
         <input
          type="file"
          id="image"
          name="image"
          onChange={formik.handleChange}
          value={formik.values.images}
        />
        <br/>


        <button type="submit">Save</button>

        </form>
      
    </div>
  )
}

export default AddPost
