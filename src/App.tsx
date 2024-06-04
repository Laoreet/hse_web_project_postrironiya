import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom"
import DataList from './components/DataList';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <>
      <Dashboard />
    </>
  );
}

export default App;
