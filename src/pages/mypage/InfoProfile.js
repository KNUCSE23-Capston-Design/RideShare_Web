import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInState } from "../../atoms";
import { customAPI } from "../../customAPI";
import styled from "styled-components";
import { ReactComponent as UserProfileImage } from "../../assets/icon/UserProfile.svg";
import { useNavigate } from "react-router-dom";
import { Column } from "react-virtualized";

const InfoProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [userInfo, setUserInfo] = useState({ id: "", pw: "", nickname: "" });
  const [changeNic, setChangeNic] = useState(false);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");
  const [isPwChangeButtonClicked, setisPwChangeButtonClicked] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() => {
    if (!accessToken) {
      navigate("/Login");
    } else {
      fetchUserInfo();
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const fetchUserInfo = async () => {
    try {
      const response = await customAPI.get(
        `http://localhost:8080/members/me`,
        {}
      );
      const data = response.data;
      setUserInfo({ id: data.id, pw: data.pw, nickname: data.nickname });
    } catch (error) {
      console.error("Failed to fetch user information:", error);
    }
  };

  // DB 전체의 닉네임들과 중복 비교를 해야하나?
  const onClickChangeNicButton = () => {
    setChangeNic(true);
  };

  const changeNicname = async () => {
    if (userInfo.nickname === nickname) {
      // 해당 기능은 렌더링 또는 알람형식으로 사용자가 인식할 수 있게 변경.
      console.log("기존 닉네임과 동일합니다.");
    } else {
      try {
        const data = await customAPI.put(`/members/nickname`, {
          nickname: nickname,
        });

        if (data.status === 200) {
          console.log("sucessfully updated nickname");
        }
      } catch (error) {
        console.log("faild to update nickname:", error);
      }
    }

    setChangeNic(false);
    fetchUserInfo();
  };

  const cancelChangeNic = () => {
    setChangeNic(false);
  };

  const cancelChangePw = () => {
    setisPwChangeButtonClicked(false);
  };

  if (!accessToken) {
    return null;
  }
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
      if (error.response.status === 400) {
        console.log("기존 비밀번호와 동일합니다.");
      }
    }

    setisPwChangeButtonClicked(false);
    fetchUserInfo();
  };

  return (
    <StyledContainer>
      <CenteredContent>
        <div style={{ width: "100%" }}>
          <ContentTitle>회원 정보</ContentTitle>
        </div>
        <StyledTable>
          <StyledRow>
            <StyledTitleCell style={{ borderTop: "2px solid black" }}>
              <SellText>사진</SellText>
            </StyledTitleCell>
            <StyledCell style={{ borderTop: "2px solid black" }}>
              <StyledImageContainer>
                <UserProfileImage
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
              </StyledImageContainer>
              <TestBox>
                <StyledButton>사진 변경</StyledButton>
                <StyledButton>사진 삭제</StyledButton>
              </TestBox>
            </StyledCell>
          </StyledRow>
          <StyledRow>
            <StyledTitleCell>
              <SellText>닉네임</SellText>
            </StyledTitleCell>
            <StyledCell>
              {changeNic ? (
                <>
                  <NickInput
                    onChange={(e) => setNickname(e.target.value)}
                    value={nickname}
                    placeholder="Nickname"
                  ></NickInput>
                  <InputButton onClick={changeNicname}>입력</InputButton>
                  <InputButton onClick={cancelChangeNic}>취소</InputButton>
                </>
              ) : (
                <>
                  <StyledTextWithMargin>
                    {userInfo.nickname}
                  </StyledTextWithMargin>
                  <StyledButton onClick={onClickChangeNicButton}>
                    닉네임 변경
                  </StyledButton>
                </>
              )}
            </StyledCell>
          </StyledRow>
          <StyledRow>
            <StyledTitleCell>
              <SellText>아이디</SellText>
            </StyledTitleCell>
            <StyledCell>
              <SellText style={{ marginLeft: "20px" }}>{userInfo.id}</SellText>
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
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <NickInput
                      onChange={(e) => setPw(e.target.value)}
                      value={pw}
                      placeholder="기존 비밀번호"
                      type="password"
                    />
                    <NickInput
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      placeholder="새로운 비밀번호"
                      type="password"
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <InputPwButton onClick={changePassword}>입력</InputPwButton>
                    <InputPwButton onClick={cancelChangePw}>취소</InputPwButton>
                  </div>
                </div>
              )}
            </StyledCell>
          </StyledRow>
        </StyledTable>
      </CenteredContent>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100vh;
`;

const ContentTitle = styled.h2`
  text-align: left;
  padding-bottom: 10px;
  color: #0583f2;
`;

const CenteredContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1%;
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
  border-left: none; /* 셀에서 왼쪽 테두리 제거 */
  border-right: none; /* 셀에서 오른쪽 테두리 제거 */
`;

const StyledButton = styled.button`
  margin: 10px;
  margin-left: 20px;
  background-color: #ffffff;
  color: #0583f2;
  padding: 5px;
  border: 1px solid #0583f2;
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
  width: 200px;
  display: table-cell;
  padding: 5px 0px;
  border: 1px solid #ddd;

  vertical-align: top; /* 셀 상단의 텍스트 정렬 */
  line-height: 1; /* 셀 높이를 줄여 텍스트를 위쪽에 가깝게 만듭니다 */
  border-left: none; /* 셀에서 왼쪽 테두리 제거 */
  border-right: none;
`;

const SellText = styled.p`
  text-decoration: none;
  font-weight: bold;
  padding: 20px;
  padding-left: 0;
`;

const StyledTextWithMargin = styled.p`
  text-decoration: none;
  font-weight: bold;
  padding: 5px;
  margin-left: 20px;
`;

const TestBox = styled.div``;

const NickInput = styled.input`
  width: 200px;
  margin: 10px;
  margin-left: 20px;
  padding: 5px;
  border: 1px solid #0583f2;
  border-radius: 10px;
`;

const InputButton = styled.button`
  margin: 10px;
  margin-top: 20px;
  background-color: #ffffff;
  color: black;

  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;

  :hover {
    color: #0583f2;
  }
`;

const InputPwButton = styled.button`
  margin: 10px;
  margin-bottom: 13px;
  background-color: #ffffff;
  color: black;

  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;

  :hover {
    color: #0583f2;
  }
`;

export default InfoProfile;
