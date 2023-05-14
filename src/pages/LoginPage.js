import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "../atoms";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // useState : 아이디와 암호 입력 값을 저장
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const navigate = useNavigate();
 
  const handleLogin = () => {
    //'handleLogin'함수는 "로그인" 버튼을 눌렀을 때 호출됨
    //버튼 클릭시 홈화면으로 이동(일시적)
    navigate("/");

    //로그인 성공시, 로그인 상태 저장
    setIsLoggedIn(true);

    //ID 및 암호 확인 로직 작성 필요
    //로그인에 성공하면 navigation.navigate()를 사용하여 다음 화면으로 이동
  };

  const handleSignUp = () => {
    //회원가입 클릭시 회원가입 화면으로 이동
    navigate("/SignUp");
  };

  return (
    <div style={styles.container}>
      <img
        src={require("../assets/logo/logo7.png")}
        style={{ width: 270, height: 60, margin: 5 }}
        alt="Logo"
      />
      <input
        style={styles.input}
        onChange={(e) => setId(e.target.value)}
        value={id}
        placeholder="id"
      />
      <input
        style={styles.input}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="password"
        type="password"
      />
      <button onClick={handleLogin} style={styles.loginButton}>
        로그인
      </button>
      <p style={styles.signupText}>
        RideShare가 처음이신가요?{" "}
        <span style={styles.signupLink} onClick={handleSignUp}>
          회원가입
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    paddingTop: "10vh",
  },
  input: {
    height: "40px",
    width: "80%",
    borderColor: "gray",
    borderWidth: "1px",
    margin: "5px",
    padding: "10px",
    backgroundColor: "#ffffff",
    color: "#D5D7F2",
    borderRadius: "10px",
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#9196F2",
    border: "none",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "16px",
  },
  signupText: {
    marginTop: "20px",
  },
  signupLink: {
    color: "#4541BF",
    cursor: "pointer",
  },
};

export default Login;
