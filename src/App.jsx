import React from 'react';
import Chat from './Chat';
import Home from './Home';

import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom';
const App = () => {
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
          <Route path="/" element={<Home/>}/>
          <Route path="chat" element={<Chat/>}/>        
        </Routes>        
      </main>
    </BrowserRouter>

  )
}

export default App;