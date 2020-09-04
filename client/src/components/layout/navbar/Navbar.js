import React, { Fragment, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AuthContext from "../../../context/auth/authContext";
import "./Navbar.css";

const Navbar = ({ title, logoProp }) => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, logOut, user, loadUser } = authContext;

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    logOut("Logged out successfully.");
  };

  const authLinks = (
    <div id="authLinkContainer">
      <p id="userName">
        Hello, {user && `${user.name[0].toUpperCase()}${user.name.slice(1)}`}
      </p>
      <li id="logout">
        <a onClick={onLogout} href="#!" id="logoutRef">
          <i className="fas fa-sign-out-alt" />
        </a>
      </li>
    </div>
  );

  const guestLinks = (
    <Fragment>
      <Link to="/login" className="li">
        Login
      </Link>
      <Link to="/register" className="li">
        Register
      </Link>
      <Link to="/about" className="li">
        About
      </Link>
    </Fragment>
  );

  return (
    <div className="navbar">
      <div className="logo">
        <i className={logoProp}></i>
        {` `}
        {title}
      </div>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  logoProp: PropTypes.string.isRequired,
};

Navbar.defaultProps = {
  title: "Contact Keeper",
  logoProp: "fas fa-id-card",
};

export default Navbar;
