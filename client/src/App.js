import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);
  const [users, setUsers] = useState([{}]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('/blogs')
      .then((resp) => resp.json())
      .then((blogs) => {
        setBlogPosts(blogs);
      })
      .catch((error) => {
        console.log('error fetching data', error);
      });
  }, []);

  useEffect(() => {
    fetch('/users')
      .then((res) => res.json())
      .then((userData) => {
        setUsers(userData);
      });
  }, [refreshPage]);

  const handleSignUpClick = () => {
    setShowSignUp(true);
    navigate('/register');
  };

  return (
    <div className="app">
      <NavBar showSignUp={handleSignUpClick} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainPage blogPosts={blogPosts} setBlogPosts={setBlogPosts} />
              <Footer />
            </>
          }
        />
        {showSignUp && (
          <Route
            path="/register"
            element={<SignUp refreshPage={refreshPage} setRefreshPage={setRefreshPage} />}
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
