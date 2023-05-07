import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./styles.module.css"

const Navbar = ({ loggedIn, onLogout, onLogin }) => {
  return (
    
      <div>
        {loggedIn ? (
          <div className={styles.navbar}>
            <li>
              <NavLink to="chat">Chat</NavLink>
            </li>
            <li  onClick={onLogout}>
              Logout
            </li>
          </div>
        ) : (
          <div className={styles.navbar}>
            <li >Home</li>
            <li >
              <NavLink onClick={onLogin}>Login</NavLink>
            </li>
          </div>
        )}
      </div>
    
  );
};

export default Navbar;
