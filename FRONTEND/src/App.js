import React, {Component} from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import About from './components/pages/About';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Mentors from './components/pages/Mentors';
import Explore from './components/pages/Explore';
import Login from './components/Login';
import Signup from './components/Singup';
import Main from './components/Main';





function App() {
  const user = localStorage.getItem("token");
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/mentors' element={<Mentors/>} />
          <Route path='/explore' element={<Explore/>} />
          <Route path='/sign-up' element={<Signup/>} />
          <Route path = '/login' exact element = {<Login/>} />
          {user && <Route path = "sign-up" exact element = {<Main/>} />}
          <Route path = "/sign-up" element = {<Navigate replace to = '/sign-up'/>} />
          


        </Routes>
      </Router>

    </>
  );
}

export default App;
