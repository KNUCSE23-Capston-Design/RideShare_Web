import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// TODO : 학교 이메일 인증
const SignUp = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSignup = () => {
    // 사용자 데이터를 데이터베이스 또는 API에 저장하기 위한 로직 작성
    // 등록이 완료되면 로그인 화면으로 이동
    navigate("/Login");
  };

  const handleLogin = () => {
    // 계정이 이미 있으면 로그인 화면으로 이동
    navigate("/Login");
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
      <input
        style={styles.input}
        onChange={(e) => setNickname(e.target.value)}
        value={nickname}
        placeholder="nickname"
      />
      <input
        style={styles.input}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="email"
        type="email"
      />
      <button onClick={handleSignup} style={styles.signupButton}>
        <div style={styles.buttonContainer}>
          <span style={styles.buttonText}>회원가입</span>
        </div>
      </button>
      <p style={styles.loginText}>
        이미 계정이 있으신가요?{" "}
        <span style={styles.loginLink} onClick={handleLogin}>
          로그인
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  signupButton: {
    width: "80%",
    marginTop: 10,
    backgroundColor: "transparent",
    border: "none",
  },
  buttonContainer: {
    backgroundColor: "#9196F2",
    display: "flex",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  loginText: {
    marginTop: 20,
  },
  loginLink: {
    color: "#4541BF",
    cursor: "pointer",
  },
};

export default SignUp;
