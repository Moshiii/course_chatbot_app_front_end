import {useState} from 'react';
import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom';

import Chat from './Chat';
import Home from './Home';

const App = () => {

  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="chat">Chat</NavLink>
        </nav>       
      </header>  
      <main>
        <Routes>
          <Route path="/" element={<Home loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>
          <Route path="chat" element={<Chat loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>       
        </Routes>        
      </main>
    </BrowserRouter>
  );
};

export default App;