import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo/mainlogo.svg";
import styled from "styled-components";

// TODO : 학교 이메일 인증
const SignUp = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:8080/members/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          pw: password,
          nickname,
          email,
        }),
      });

      if (response.ok) {
        // 회원가입 성공
        navigate("/Login");
      } else {
        // 회원가입 실패
        console.log("Registration failed. Please try again.");
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  const handleLogin = () => {
    // 계정이 이미 있으면 로그인 화면으로 이동
    navigate("/Login");
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
        value={password}
        placeholder="Password"
        type="password"
      />
      <Input
        onChange={(e) => setNickname(e.target.value)}
        value={nickname}
        placeholder="Nickname"
      />
      <Input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
        type="email"
      />
      <SignUpButton onClick={handleSignup}>
        <ButtonContainer>
          <ButtonText>회원가입</ButtonText>
        </ButtonContainer>
      </SignUpButton>
      <LoginText>
        이미 계정이 있으신가요?{" "}
        <LoginLink onClick={handleLogin}>로그인</LoginLink>
      </LoginText>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MainLogo = styled(Logo)`
  width: 140px;
  height: 50px;
  margin-top: 14px;
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

const SignUpButton = styled.button`
  background-color: #0583f2;
  border: none;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
  color: #ffffff;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonText = styled.span`
  color: white;
  font-size: 16px;
`;

const LoginText = styled.p`
  margin-top: 20px;
`;

const LoginLink = styled.span`
  color: #0583f2;
  cursor: pointer;
`;

export default SignUp;
