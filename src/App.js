import React, { Component } from "react";
import { Switch, Routes, Route } from "react-router-dom";
import "./App.css";
import { RecoilRoot } from "recoil";
import Header from './components/Header';
import Home from "./pages/HomePage";
import Carpool from "./pages/Carpool/Carpoolpage";
import Taxi from "./pages/Taxi/Taxipage";
import Info from "./pages/InfoPage";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";

function App() {
  return (
    <RecoilRoot>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Carpool" element={<Carpool />} />
        <Route path="/Taxi" element={<Taxi />} />
        <Route path="/Info" element={<Info />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </RecoilRoot>
  );
}

export default App;
