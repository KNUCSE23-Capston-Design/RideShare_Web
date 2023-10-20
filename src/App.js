import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { RecoilRoot } from "recoil";
import Header from "./components/Header";
import Home from "./pages/HomePage";
import Info from "./pages/mypage/InfoPage";
import InfoProfile from "./pages/mypage/InfoProfile";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";
import MyParty from "./pages/mypage/MyParty";
import JoinParty from "./pages/mypage/JoinParty";
import ChatRoom from "./pages/Chat";
import { NavermapsProvider } from "react-naver-maps";

function App() {
  const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;

  return (
    <NavermapsProvider ncpClientId={clientId}>
      <RecoilRoot>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Info/*" element={<Info />}>
            <Route path="Profile" element={<InfoProfile />} />
            <Route path="MyParty" element={<MyParty />} />
            <Route path="JoinParty" element={<JoinParty />} />
          </Route>
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Chat" element={<ChatRoom />} />
        </Routes>
      </RecoilRoot>
    </NavermapsProvider>
  );
}

export default App;
