import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { setRefreshToken } from "../Cookies";
import { accessTokenState } from "../atoms";
import { isLoggedInState } from "../atoms";
import { useNavigate, Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo/mainlogo.svg";
import styled from "styled-components";

const Login = () => {
  // useState : 아이디와 암호 입력 값을 저장
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  // AccessToekn State
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const navigate = useNavigate();

  // 암걸려서 만든 엔터키 이벤트 감지
  const handleOnkeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      // 로그인 자격 증명을 확인하기 위해 서버에 API 요청
      const response = await fetch("http://localhost:8080/members/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          pw: password,
        }),
      });

      if (response.ok) {
        // 로그인 성공
        const data = await response.json();
        // 서버에서 발행한 토큰
        const { accessToken, refreshToken } = data;

        setAccessToken(accessToken);
        console.log(accessToken);
        setRefreshToken(refreshToken);
        console.log(refreshToken);

        setIsLoggedIn(true);
        navigate("/");
        console.log("Login seccess");
      } else {
        // 로그인 실패
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSignUp = () => {
    //회원가입 클릭시 회원가입 화면으로 이동
    navigate("/SignUp");
  };

  return (
    <StyledContainer>
      <Link to="/">
        <MainLogo />
      </Link>
      <Input
        onChange={(e) => setId(e.target.value)}
        value={id}
        placeholder="ID"
      />
      <Input
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleOnkeyDown}
        value={password}
        placeholder="Password"
        type="password"
      />
      <LoginButton onClick={handleLogin}>로그인</LoginButton>
      <SignupText>
        RideShare가 처음이신가요?{" "}
        <SignupLink onClick={handleSignUp}>회원가입</SignupLink>
      </SignupText>
    </StyledContainer>
  );
};

const MainLogo = styled(Logo)`
  width: 140px;
  height: 50px;
  margin-top: 14px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #ffffff;
  padding-top: 10vh;
`;

const LogoImage = styled.img`
  width: 270px;
  height: 60px;
  margin: 5px;
`;

const Input = styled.input`
  height: 40px;
  width: 250px;
  border-color: gray;
  border-width: 1px;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
`;

const LoginButton = styled.button`
  background-color: #0583f2;
  border: none;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
  color: #ffffff;
  font-size: 16px;
`;

const SignupText = styled.p`
  margin-top: 20px;
`;

const SignupLink = styled.span`
  color: #0583f2;
  cursor: pointer;
`;

export default Login;
