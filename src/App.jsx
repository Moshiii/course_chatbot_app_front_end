import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./Navbar";
import Chat from "./Chat";
import Home from "./Home";
// import Login from "./Login";
import Cookies from "universal-cookie";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const cookies = new Cookies();

  useEffect(() => {
    let loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn) {
      setLoggedIn(true);
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    await fetch(
      "https://ec2-44-212-203-117.compute-1.amazonaws.com:5000/api/discordLogin"
    )
      .catch(console.error)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("loggedIn", true);
        setLoggedIn(true);

        window.location.href = data.auth_url;
      });
  };

  const handleLogout = async () => {
    // Perform the logout logic here

    const token = cookies.get("access_token");
    await fetch(
      "https://ec2-44-212-203-117.compute-1.amazonaws.com:5000/api/discordLogout",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .catch(console.error)
      .then((response) => {
        console.log(response);
        cookies.remove("allMessages", { path: "/chat" });
        localStorage.removeItem("loggedIn");
        setLoggedIn(false);
      });
  };

  return (
    <BrowserRouter>
      {loading ? (
        <p>loading...</p>
      ) : (
        <div className="banner">
          <div className="nav_item">
            <Navbar
              loggedIn={loggedIn}
              onLogout={handleLogout}
              onLogin={handleLogin}
            />
          </div>
          <main className="nav_msg">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="chat" element={<Chat loggedIn={loggedIn} />} />
            </Routes>
          </main>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;
