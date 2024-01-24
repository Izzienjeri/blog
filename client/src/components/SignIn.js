import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import {store,retrieve} from "../Encryption"

const SignIn = ({ setShowProfilePage, setUser, user, showProfilePage, blogPosts, setIsLoggedIn }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    username: yup.string().required('Must Enter a username'),
    password: yup.string().required('Must Enter a Password').min(8),
  });
  
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },

    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      setError(null);

      fetch(`/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values, null, 2),
      })
        .then((loginResponse) => {
          if (loginResponse.status === 200) {
           return loginResponse.json()
          } else {
            throw new Error('Invalid username or password.');
          }
        })
        .then((data)=>{
          console.log(data)
          store(data)
        
          setIsLoggedIn(true)
          navigate('/profile_page')
        })
          .catch((error) => {
          setLoading(false);
          setError('Error logging in. Please try again.');
          console.error('Error while signing in:', error);
        });
    },
  });

  return (
    <div className="ui centered card">
      <h1>User Sign In Form</h1>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username</label>
        <br />
        <input className="ui input focus" id="username" name="username" onChange={formik.handleChange} value={formik.values.username} />
        <p style={{ color: 'red' }}>{formik.errors.username}</p>

        <label htmlFor="password">Password</label>
        <br />
        <input
          className="ui input focus"
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <p style={{ color: 'red' }}>{formik.errors.password}</p>

        <button type="submit" disabled={loading} className="mini ui teal button" style={{marginBottom:"30px" }}>
          {loading ? 'Loading...' : 'Submit'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <Link className="Back" to="/">
        Back to HomePage
      </Link>
      {showProfilePage && <ProfilePage blogPosts={blogPosts} />}
    </div>
  );
};

export default SignIn;
