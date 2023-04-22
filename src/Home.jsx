import {useEffect, useState} from 'react';

const Home = ({ loggedIn, setLoggedIn }) => {

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let loggedIn = localStorage.getItem('loggedIn');

    if(loggedIn) {
      setLoggedIn(true);
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)

    await fetch("https://ec2-44-212-203-117.compute-1.amazonaws.com:5000/api/discordLogin")
      .catch(console.error)
      .then((response) => {
        console.log(response)
      });
      // .then(response => response.json())
      // .then(data => {
      //   console.log(data)
      //   // window.location.href = data.auth_url;
      // });
  }

  return (
    <div className="layout">
      <div className="loading">
        {loading ? (
        <p>Loading...</p>
        ) : loggedIn ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
        ) : (
        <div>
          <button onClick={handleLogin}>Login with discord</button>
        </div>
        )}
      </div>
      
    </div>
  );
}

export default Home;