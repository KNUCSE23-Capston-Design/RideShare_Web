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
  const [IdDuplicate, setIdDuplicate] = useState(true); //ID 중복 상태를 추적할 상태 변수
  const [NicknameDuplicate, setNicknameDuplicate] = useState(true); //Nickname 중복 상태를 추적할 상태 변수
  const [EmailDuplicate, setEmailDuplicate] = useState(true); //Email 중복 상태를 추적할 상태 변수

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

  // 중복 여부 확인
  const checkForDuplicate = async (inputValue, fieldName) => {
    try {
      const response = await fetch(`http://localhost:8080/members/check?${fieldName}=${inputValue}`);
      if (response.ok) { //중복 없음
        if (fieldName == "id") {
          setIdDuplicate(true);
        }
        else if (fieldName == "nickname") {
          setNicknameDuplicate(true);
        }
        else {
          setEmailDuplicate(true);
        }
      } else { //중복 있음
        if (fieldName == "id") {
          setIdDuplicate(false);
        }
        else if (fieldName == "nickname") {
          setNicknameDuplicate(false);
        }
        else {
          setEmailDuplicate(false);
        }
      }
    } catch (error) {
      console.error("Error checking for duplicate:", error);
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
        onBlur={() => checkForDuplicate(id, "id")}
        value={id}
        placeholder="ID"
        style={{
          borderColor: IdDuplicate ? 'gray' : 'red',
          borderWidth: IdDuplicate ? '1px' : '3px'
        }}
      />
      {IdDuplicate === false && (
        <ErrorMessage>아이디: 사용할 수 없는 아이디입니다. 다른 아이디를 입력해 주세요.</ErrorMessage>
      )}
      <Input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
        type="password"
      />
      <Input
        onChange={(e) => setNickname(e.target.value)}
        onBlur={() => checkForDuplicate(nickname, "nickname")}
        value={nickname}
        placeholder="Nickname"
        style={{
          borderColor: NicknameDuplicate ? 'gray' : 'red',
          borderWidth: NicknameDuplicate ? '1px' : '3px'
        }}
      />
      {NicknameDuplicate === false && (
        <ErrorMessage>닉네임: 사용할 수 없는 닉네임입니다. 다른 닉네임을 입력해 주세요.</ErrorMessage>
      )}
      <Input
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => checkForDuplicate(email, "email")}
        value={email}
        placeholder="Email"
        type="email"
        style={{
          borderColor: EmailDuplicate ? 'gray' : 'red',
          borderWidth: EmailDuplicate ? '1px' : '3px'
        }}
      />
      {EmailDuplicate === false && (
        <ErrorMessage>이메일: 사용할 수 없는 이메일입니다. 다른 이메일을 입력해 주세요.</ErrorMessage>
      )}
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

const ErrorMessage = styled.li`
  color: red;
  list-style-type: disc; //둥근 점(disc)표시
`;

const LoginLink = styled.span`
  color: #0583f2;
  cursor: pointer;
`;

export default SignUp;
