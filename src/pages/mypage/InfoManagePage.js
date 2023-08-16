import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInState } from "../../atoms";
import styled from "styled-components";
import { Link } from "react-router-dom";
import UserProfile from "../../assets/icon/UserProfile.png";
import { customAPI } from "../../customAPI";

const InfoManage = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [userInfo, setUserInfo] = useState({ id: "", pw: "", nickname: "" });
  const [isPwChangeButtonClicked, setisPwChangeButtonClicked] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() => {
    // Fetch user information using the access token when the component mounts
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Need page movement logic when logout button is clicked
  };

  const fetchUserInfo = async () => {
    try {
      const response = await customAPI.get(`http://localhost:8080/members/me`);
      const data = response.data;
      setUserInfo({ id: data.id, pw: data.pw, nickname: data.nickname });
    } catch (error) {
      console.error("Failed to fetch user information:", error);
    }
  };

  const onClickChangePwButton = () => {
    setisPwChangeButtonClicked(true);
  };

  const changePassword = async () => {
    // 서버의 중복 체크 또는 기존 비밀번호가 암호화되어 있기 때문에 확인 불가능. 서버에서 처리하는 것이 나을것.
    // 필요 기능 : 비밀번호 중복체크
    // if (userInfo.pw === newPassword) {
    //   // 해당 기능은 렌더링 또는 알람형식으로 사용자가 인식할 수 있게 변경.
    //   console.log("기존 비밀번호과 동일합니다.");
    //   return;
    // }
    // if (userInfo.pw !== pw) {
    //   // 해당 기능은 렌더링 또는 알람형식으로 사용자가 인식할 수 있게 변경.
    //   console.log("기존 비밀번호가 틀립니다.");
    //   console.log(userInfo.pw, pw);
    //   return;
    // }

    try {
      const data = await customAPI.put(`/members/password`, {
        oldPassword: pw,
        newPassword: newPassword,
      });

      if (data.status === 200) {
        console.log("sucessfully updated password");
      }
    } catch (error) {
      console.log("faild to update password:", error);
    }
  };

  return (
    <StyledContainer>
      <LeftSection>
        <StyledHeading>마이페이지</StyledHeading>
        <div>
          <StyledText>
            <Link to="/Info">
              <strong>내 프로필</strong>
            </Link>
          </StyledText>
          <StyledText>
            <Link to="/Info/Manage">
              <strong>계정 관리</strong>
            </Link>
          </StyledText>
          <StyledText>
            <Link to="/Info/MyParty">
              <strong>작성 글</strong>
            </Link>
          </StyledText>
          <StyledText>
            <strong>Share 후기</strong>
          </StyledText>
        </div>
      </LeftSection>
      <RightSection>
        <StyledHeading>계정 관리</StyledHeading>
        <CenteredContent>
          <StyledTable>
            <StyledRow>
              <StyledTitleCell>
                <SellText>아이디</SellText>
              </StyledTitleCell>
              <StyledCell>
                <SellText>{userInfo.id}</SellText>
              </StyledCell>
            </StyledRow>
            <StyledRow>
              <StyledTitleCell>
                <SellText>비밀번호</SellText>
              </StyledTitleCell>
              <StyledCell>
                {!isPwChangeButtonClicked ? (
                  <StyledButton onClick={onClickChangePwButton}>
                    비밀번호 변경
                  </StyledButton>
                ) : (
                  <>
                    <input
                      onChange={(e) => setPw(e.target.value)}
                      value={pw}
                      placeholder="기존 비밀번호"
                      type="password"
                    />
                    <input
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      placeholder="새로운 비밀번호"
                      type="password"
                    />
                    <button onClick={changePassword}>입력</button>
                  </>
                )}
              </StyledCell>
            </StyledRow>
          </StyledTable>
        </CenteredContent>
      </RightSection>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100vh;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 20px;
  padding: 20px;
`;

const RightSection = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  padding: 60px;
  background-color: #f9fbfc;
  border-left: 1px solid #ccc;
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1%;
  margin-right: 60%;
`;

const StyledHeading = styled.h1`
  text-align: left;
  padding-bottom: 50px;
`;

const StyledTable = styled.div`
  display: table;
  width: 100%;
  border-collapse: collapse;
`;

const StyledRow = styled.div`
  display: table-row;
`;

const StyledCell = styled.div`
  display: table-cell;
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #f4f8fe;
  border-left: none; /* 셀에서 왼쪽 테두리 제거 */
  border-right: none; /* 셀에서 오른쪽 테두리 제거 */
`;

const StyledButton = styled.button`
  margin: 10px;
  margin-left: 20px;
  background-color: #0583f2;
  color: white;
  padding: 5px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
`;

const StyledImageContainer = styled.div`
  margin: 10px;
  margin-top: 30px;
  margin-left: 20px;
`;

const StyledTitleCell = styled.div`
  display: table-cell;
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  vertical-align: top; /* 셀 상단의 텍스트 정렬 */
  line-height: 1; /* 셀 높이를 줄여 텍스트를 위쪽에 가깝게 만듭니다 */
  border-left: none; /* 셀에서 왼쪽 테두리 제거 */
`;

const StyledText = styled.p`
  text-decoration: none;
  font-weight: bold;
  padding: 5px;
`;

const SellText = styled.p`
  text-decoration: none;
  font-weight: bold;
  padding: 20px;
`;

const StyledTextWithMargin = styled.p`
  text-decoration: none;
  font-weight: bold;
  padding: 5px;
  margin-left: 20px;
`;

export default InfoManage;
