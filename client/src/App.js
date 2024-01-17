import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import MainPage from "./components/MainPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Footer from "./components/Footer";
import "./App.css";
import ProfilePage from "./components/ProfilePage";
import SingleBlogPage from "./components/SingleBlogPage";
import UpdatePost from "./components/UpdatePost";
import AddPost from "./components/AddPost";

function App() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("user") ? true : false
  );

  const navigate = useNavigate();

  const fetchBlogPosts = () => {
    fetch("/blogs")
      .then((resp) => resp.json())
      .then((blogs) => {
        setBlogPosts(blogs);
      })
      .catch((error) => {
        console.log("error fetching data", error);
      });
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleSignUpClick = () => {
    setShowSignUp(true);
    navigate("/register");
  };
  const handleSignInClick = () => {
    setShowSignIn(true);
    navigate("/signIn", { replace: true });
  };
  const handleSignOutClick = () => {
    fetch("/logout")
      .then(() => {
        localStorage.removeItem("user");
        setIsLoggedIn(null);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log("error logging out", error);
      });
  };
  const handleClick = (id) => {
    navigate(`/blog_page/${id}`);
  };

  return (
    <div className="app">
      <NavBar
        showSignUp={handleSignUpClick}
        showSignIn={handleSignInClick}
        showSignOut={handleSignOutClick}
        isLoggedIn={isLoggedIn}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainPage
                blogPosts={blogPosts}
                setBlogPosts={setBlogPosts}
                handleClick={handleClick}
                fetchBlogPosts={fetchBlogPosts}
              />
              <Footer />
            </>
          }
        />

        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate replace to="/" />
            ) : (
              <SignUp setShowSignIn={setShowSignIn} />
            )
          }
        />

        <Route
          path="/signIn"
          element={
            isLoggedIn ? (
              <Navigate replace to="/" />
            ) : (
              <SignIn
                setShowProfilePage={setShowProfilePage}
                showProfilePage={showProfilePage}
                setUser={setUser}
                user={user}
                blogPosts={blogPosts}
                setIsLoggedIn={setIsLoggedIn}
              />
            )
          }
        />

        <Route
          path="/profile_page"
          element={
            !isLoggedIn ? (
              <Navigate replace to="/register" />
            ) : (
              <ProfilePage fetchBlogPosts={fetchBlogPosts} />
            )
          }
        />
        <Route path="/blog_page/:id" element={<SingleBlogPage />} />
        <Route path="/update_blog/:id" element={<UpdatePost post={post} />} />
        <Route
          path="/add_post"
          element={<AddPost fetchBlogPosts={fetchBlogPosts}  setPosts={setBlogPosts}/>}
        />
      </Routes>
    </div>
  );
}

export default App;
