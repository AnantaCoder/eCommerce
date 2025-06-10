// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import React from 'react';
import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} /> 
          <Route path="/home" element={<HomePage />} />
        </Route>
        


        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;