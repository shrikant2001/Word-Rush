import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import "./App.css";
import {SocketContext, socket} from "./context/socket.js";

import Home from './components/Home/Home.jsx';
import Lobby from './components/Lobby/Lobby.jsx';
import Game from './components/Game/Game.jsx';


function App() {

  return (

    <SocketContext.Provider value={socket}>
    <div className='App'>
      <Router>

      <Routes>
        <Route exact path="/" element={<Home/>}>  </Route>
        <Route exact path={`/Lobby/:room`} element={<Lobby/>}>  </Route>
        <Route exact path={`/Game/:room`} element={<Game/>}>  </Route>
      </Routes>
      </Router>
      
    </div>
    </SocketContext.Provider>

  );
}

export default App;
