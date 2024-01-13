import React from 'react';
import Logo from '../img/Logo.png';
import { Link } from 'react-router-dom';

const NavBar = ({ user, showSignUp, showSignIn, showSignOut }) => {
  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>

        <div className="menu_container">
          <Link className="menu" to="/menu1">
            Generative AI
          </Link>
          <Link className="menu" to="/menu2">
            Machine Learning
          </Link>
          <Link className="menu" to="/menu3">
            AI Applications
          </Link>
          <Link className="menu" to="/menu4">
            AI News
          </Link>
        </div>

        <div className="links">
          {user ? (
            <>
              <button className="link" onClick={showSignOut}>
                <h4>Sign Out</h4>
              </button>
              <Link className="link" to="/profile_page">
                <h4>Profile</h4>
              </Link>
            </>
          ) : (
            <>
              
              {!user && (
                <>
                  <button className="link" onClick={showSignIn}>
                    <h4>Sign In</h4>
                  </button>
                  <button className="link" onClick={showSignUp}>
                    <h4>Sign Up</h4>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
