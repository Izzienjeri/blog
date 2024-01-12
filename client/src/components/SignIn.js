import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ refreshPage, setRefreshPage,setShowProfilePage }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate=useNavigate()

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
    onSubmit: (values,{resetForm}) => {
      setLoading(true);
      setError(null);

      fetch(`/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values, null, 2),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 201) {
            
            resetForm()
            setRefreshPage(!refreshPage);
            console.log('Welcome!');
            navigate('/profile_page',{ replace: true })
            setShowProfilePage(true)
            
          } else {
            setError('Invalid username or password.');
          }
        })
        .catch((error) => {
          setLoading(false);
          setError('Error logging in. Please try again.');
          console.error('Error while signing in:', error);
        });
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
    </div>
  );
};

export default SignIn;
