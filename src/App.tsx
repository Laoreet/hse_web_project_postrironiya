
import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles.css'
import {Route, Routes, createBrowserRouter} from "react-router-dom"
import DataList from './components/DataList';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import ErrorPage from './components/Error-page';
import Login from './components/Login';
import Register from './components/Register';
import Dormitories from './components/Dormitories';
import Slots from './components/Slots';
import WashingMachines from './components/WashingMachines';
import Profile from './components/Profile';
import SlotsSchedule from './components/SlotsSchedule';


function App() {
  return (
    <Routes>
       <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dormitories" element={<Dormitories />}/>
      <Route path="/slots" element={<Slots />}/>
      
      <Route path="/slotsschedule" element={<SlotsSchedule />}/>
      <Route path="/washmachines" element={<WashingMachines />}/>
      <Route path='/profile' element={<Profile />} />
      <Route path="*" element={<ErrorPage />}/>
    </Routes>
  );
}

export default App;
