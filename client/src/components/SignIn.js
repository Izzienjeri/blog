import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProfilePage from './ProfilePage';

const SignIn = ({ setShowProfilePage, setUser,user,showProfilePage,blogPosts,setIsLoggedIn}) => {
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
      onSubmit: async (values, { resetForm }) => {
        setLoading(true);
        setError(null);
  
        try {
          const loginResponse = await fetch(`/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values, null, 2),
          });
  
          if (loginResponse.status === 201) {
        
            const sessionResponse = await fetch('/check_session');
            const userData = await sessionResponse.json();
           localStorage.setItem("user",JSON.stringify(userData))
  
            setUser(userData);
            
  
            console.log(userData);
            console.log(user)
            
            setIsLoggedIn(true)
           
            navigate('/profile_page', { replace: true },{state:userData});
            setShowProfilePage(true);

          } else {
            setError('Invalid username or password.');
          }
        } catch (error) {
          setLoading(false);
          setError('Error logging in. Please try again.');
          console.error('Error while signing in:', error);
        }
      },
    });
  
  return (
    <div className="auth">
      <h1>User Sign In Form</h1>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        <p style={{ color: 'red' }}>{formik.errors.username}</p>

        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <p style={{ color: 'red' }}>{formik.errors.password}</p>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>


      <Link className="Back" to="/">
        Back to HomePage
      </Link>
      {showProfilePage && <ProfilePage blogPosts={blogPosts}/>}

    </div>
  );
};

export default SignIn;
