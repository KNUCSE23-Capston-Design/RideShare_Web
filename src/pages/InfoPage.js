import React from "react";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "../atoms";

const Info = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  const handleLogout = () => {
    setIsLoggedIn(false);
    //로그아웃 버튼 클릭시 페이지 이동 로직 필요
  };

  return (
    <div style={styles.container}>
      <h1>Info</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const styles = {
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
};
export default Info;
