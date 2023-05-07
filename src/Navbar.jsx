import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ loggedIn, onLogout, onLogin }) => {
  return (
    <nav>
      <ul>
        <li>Home</li>
        {loggedIn ? (
          <div>
            <li onClick={onLogout}>Logout</li>
            <NavLink to="chat">Chat</NavLink>
          </div>
        ) : (
          <li>
            <NavLink to="login" onClick={onLogin}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
