import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Footer from './components/Footer';
import './App.css';
import ProfilePage from './components/ProfilePage';

function App() {
  const [users, setUsers] = useState([{}]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);  
  const [refreshPage, setRefreshPage] = useState(false);
  const[showSignIn,setShowSignIn]=useState(false)  
  const[showProfilePage,setShowProfilePage]=useState(false)

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
  const handleSignInClick=()=>{
    setShowSignIn(true);
    navigate('/signIn', { replace: true });
  }

  return (
    <div className="app">
      <NavBar showSignUp={handleSignUpClick}  showSignIn={handleSignInClick}/>
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
        {showSignIn && (
          <Route
            path="/signIn"
            element={<SignIn refreshPage={refreshPage} setRefreshPage={setRefreshPage}  setShowProfilePage={setShowProfilePage}/>}
          />
        )}
        {showProfilePage && (
          <Route
            path="/profile_page"
            element={<ProfilePage refreshPage={refreshPage} setRefreshPage={setRefreshPage} setShowProfilePage={setShowProfilePage} users={users} />}
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
