import React from 'react';
import { useFormik } from 'formik';

const AddComment = ({ handleComment,blogPost }) => {
  const formik = useFormik({
    initialValues: {
      guest_name: '',
      content: '',
      post_id:blogPost.id,
    },
    onSubmit: (values, { resetForm }) => {
      try {
       
        const encryptedData = localStorage.getItem('jwt');

        
        if (encryptedData) {
         
          handleComment(values);
        } else {
          
          fetch('/comments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to submit comment');
              }
              return response.json();
            })
            .then((data) => {
              console.log('Comment submitted successfully:', data);
             
            })
            .catch((error) => {
              console.error('Error submitting comment:', error);
             
            });
        }

   
        resetForm();
      } catch (error) {
        console.error('Error submitting comment:', error);
      
      }
    },
  });

  return (
    <div>
      <div>
        <h2>Comment on the Post</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="add_comment">
            <label htmlFor="guest_name">Guest Name</label>
            <br />
            <input
              id="guest_name"
              name="guest_name"
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
    </div>
  );
};

export default AddComment;
