import {useEffect, useState} from 'react';

import Cookies from 'universal-cookie';


const Home = ({ loggedIn, setLoggedIn }) => {

  const [loading, setLoading] = useState(false);
  const cookies = new Cookies();

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
      .then(response => response.json())
      .then((data) => {
        localStorage.setItem('loggedIn', true);
        setLoggedIn(true);

        window.location.href = data.auth_url;
      });
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    const token = cookies.get('access_token');
    await fetch("https://ec2-44-212-203-117.compute-1.amazonaws.com:5000/api/discordLogout", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .catch(console.error)
      .then(response => {
        console.log(response)
        localStorage.removeItem('loggedIn');
        setLoggedIn(false);
      });
  };

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