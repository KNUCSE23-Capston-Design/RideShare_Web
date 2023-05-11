import React, { Component } from "react";
import { Switch, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/HomePage";
import Carpool from "./pages/Carpool/Carpoolpage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Carpool" element={<Carpool />} />
        </Routes>
    );
}

export default App;
