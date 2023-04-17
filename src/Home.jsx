import React from 'react';

const Home = () => {

  const userLogin = async (e) => {
    e.preventDefault();
    await fetch("https://127.0.0.1:5000/api/discordLogin")
      .catch(console.error)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        window.location.href = data.auth_url;
      })
  }

  return (
    <div className="layout">
      <div className="login_page">
        <button onClick={userLogin}>login with discord</button>
      </div>
    </div>
  );
}

export default Home;