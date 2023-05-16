import React, { Component } from "react";
import { Switch, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/HomePage";
import Carpool from "./pages/Carpool/Carpoolpage";
import { NavermapsProvider } from "react-naver-maps";
import { useNavermaps } from "react-naver-maps";
import { RecoilRoot } from "recoil";

function App() {
    return (
        <NavermapsProvider ncpClientId="9mq5hlqrjf">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/carpool" element={<Carpool />} />
            </Routes>
        </NavermapsProvider>
    );
}

export default App;
