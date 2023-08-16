import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInState } from "../../atoms";
import { customAPI } from "../../customAPI";
import styled from "styled-components";
import { Link } from "react-router-dom";
import UserProfile from "../../assets/icon/UserProfile.png";
import { useNavigate } from "react-router-dom";

const Info = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [userInfo, setUserInfo] = useState({ id: "", pw: "", nickname: "" });
  const [changeNic, setChangeNic] = useState(false);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");

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
  };

  if (!accessToken) {
    return null;
  }

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
            <strong>작성 글</strong>
          </StyledText>
          <StyledText>
            <strong>Share 후기</strong>
          </StyledText>
        </div>
      </LeftSection>
      <RightSection>
        <StyledHeading>프로필 수정</StyledHeading>
        <CenteredContent>
          <StyledTable>
            <StyledRow>
              <StyledTitleCell>
                <SellText>프로필 사진</SellText>
              </StyledTitleCell>
              <StyledCell>
                <StyledImageContainer>
                  <img
                    src={UserProfile}
                    alt="UserProfile"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                </StyledImageContainer>
                <StyledButton>사진 변경</StyledButton>
                <StyledButton>사진 삭제</StyledButton>
              </StyledCell>
            </StyledRow>
            <StyledRow>
              <StyledTitleCell>
                <SellText>별명</SellText>
              </StyledTitleCell>
              <StyledCell>
                {changeNic ? (
                  <>
                    <input
                      onChange={(e) => setNickname(e.target.value)}
                      value={nickname}
                      placeholder="Nickname"
                    ></input>
                    <button onClick={changeNicname}>입력</button>
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

export default Info;
