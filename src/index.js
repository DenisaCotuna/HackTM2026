import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './landingloginregistration/Login';
import Register from './landingloginregistration/Register';
import SDashboard from './students/SDashboard';
import ODashboard from './owners/ODashboard';
import SRequest from './students/SRequest';
import SSearch from './students/SSearch';
import ORequest from './owners/ORequest';
import OSearch from './owners/OSearch';
import Match from './match/match';
import Chat from './chat/chat';
import SVisit from './students/SVisit';
import OVisit from './owners/OVisit';
import Appointment from './match/appointment';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Sdashboard" element={<SDashboard />} />
        <Route path="/Ssearch" element={<SSearch />} />
        <Route path="/Odashboard" element={<ODashboard />} />
        <Route path="/Srequest" element={<SRequest />} />
        <Route path="/Orequest" element={<ORequest />} />
        <Route path="/Osearch" element={<OSearch />} />
        <Route path="/match" element={<Match />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/SVisit" element={<SVisit />} />
        <Route path="/OVisit" element={<OVisit />} />
        <Route path="/appointment" element={<Appointment />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
