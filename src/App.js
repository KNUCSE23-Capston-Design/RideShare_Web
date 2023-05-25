import React, { Component } from "react";
import { Switch, Routes, Route } from "react-router-dom";
import "./App.css";
import { RecoilRoot } from "recoil";
import Header from "./components/Header";
import Home from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import Info from "./pages/InfoPage";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";
import { NavermapsProvider } from "react-naver-maps";

function App() {
    return (
        <NavermapsProvider ncpClientId="9mq5hlqrjf">
            <RecoilRoot>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/MapPage" element={<MapPage />} />
                    <Route path="/Info" element={<Info />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/SignUp" element={<SignUp />} />
                </Routes>
            </RecoilRoot>
        </NavermapsProvider>
    );
}

export default App;
