import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "../../atoms";
import { customAPI } from "../../customAPI";
import styled from "styled-components";
import { ReactComponent as UserProfileImage } from "../../assets/icon/UserProfile.svg";
import { useNavigate } from "react-router-dom";
import { removeCookieToken } from "../../Cookies";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InfoProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [userInfo, setUserInfo] = useState({
    id: "",
    pw: "",
    nickname: "",
    score: "",
  });
  const [changeNic, setChangeNic] = useState(false);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");
  const [isPwChangeButtonClicked, setisPwChangeButtonClicked] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [checkNewPassword, setCheckNewPassword] = useState("");
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
  const [isNicDup, setIsNickDup] = useState(false);
  const [pw, setPw] = useState("");

  const showPopupMessage = (msg) => {
    if (msg === "pw") {
      toast.success("비밀번호가 변경되었습니다. 다시 로그인해주십시오.", {
        autoClose: 900, // 자동 닫힘 지속 시간을 1초로 설정
        onClose: handleClose, // 토스트가 닫히면 글쓰기 창 닫기() 실행
      });
    } else if (msg === "nick") {
      toast.success("닉네임이 변경되었습니다.", {
        autoClose: 900, // 자동 닫힘 지속 시간을 1초로 설정
      });
    }
  };

  const handleClose = () => {
    removeCookieToken();
    sessionStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/Login");
    } else {
      fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await customAPI.get(`/members/me`, {});
      const data = response.data;
      console.log(data);
      setUserInfo({
        id: data.id,
        pw: data.pw,
        nickname: data.nickname,
        score: data.score,
      });
    } catch (error) {
      console.error("Failed to fetch user information:", error);
    }
  };

  const checkNicnameDuplication = async () => {
    try {
      const response = await customAPI.get(
        `/members/check?nickname=${nickname}`
      );

      if (response.status === 200) {
        return false;
      }
    } catch (error) {
      if (error.response.data.status === 400) {
        console.log(error);
        return true;
      }
    }
  };

  const changeNicname = async () => {
    const isNicknameDuplicate = await checkNicnameDuplication();

    if (userInfo.nickname === nickname) {
      console.log("기존 닉네임과 동일합니다.");
    } else if (isNicknameDuplicate) {
      console.log("이미 사용중인 닉네임입니다.");
      setIsNickDup(true);
    } else {
      try {
        const data = await customAPI.put(`/members/nickname`, {
          nickname: nickname,
        });

        if (data.status === 200) {
          console.log("sucessfully updated nickname");
        }

        setChangeNic(false);
        setNickname("");
        fetchUserInfo();
        showPopupMessage("nick");
      } catch (error) {
        console.log("faild to update nickname:", error);
      }
    }

    setNickname("");
  };

  const onClickChangeNicButton = () => {
    setChangeNic(true);
  };

  const cancelChangeNic = () => {
    setChangeNic(false);
    setIsNickDup(false);
    setNickname("");
  };

  const cancelChangePw = () => {
    setisPwChangeButtonClicked(false);
    setPasswordsDoNotMatch(false);
    setPw("");
    setCheckNewPassword("");
    setNewPassword("");
  };

  if (!accessToken) {
    return null;
  }
  const onClickChangePwButton = () => {
    setisPwChangeButtonClicked(true);
  };

  const changePassword = async () => {
    if (newPassword !== checkNewPassword) {
      setPasswordsDoNotMatch(true);
    } else {
      try {
        const data = await customAPI.put(`/members/password`, {
          oldPassword: pw,
          newPassword: newPassword,
        });

        if (data.status === 200) {
          console.log("sucessfully updated password");
        }

        setPw("");
        setCheckNewPassword("");
        setNewPassword("");
      } catch (error) {
        console.log("faild to update password:", error);
        if (error.response.status === 400) {
          console.log("기존 비밀번호와 동일합니다.");
        }
      }

      setisPwChangeButtonClicked(false);
      showPopupMessage("pw");
    }
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
              <SellText>나의 점수</SellText>
            </StyledTitleCell>
            <StyledCell>
              <SellText style={{ marginLeft: "20px" }}>
                {userInfo.score === null ? "0점" : userInfo.score}
              </SellText>
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
                  {isNicDup ? (
                    <ErrorMessage>이미 사용중인 닉네임입니다.</ErrorMessage>
                  ) : null}
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
                    <NickInput
                      onChange={(e) => setCheckNewPassword(e.target.value)}
                      value={checkNewPassword}
                      placeholder="비밀번호 확인"
                      type="password"
                    />
                    {passwordsDoNotMatch ? (
                      <ErrorMessage>
                        새로운 비밀번호가 맞지 않습니다.
                      </ErrorMessage>
                    ) : null}
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
      <ToastContainer />
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

const ErrorMessage = styled.div`
  margin: 10px;
  margin-left: 20px;
  color: red;
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
