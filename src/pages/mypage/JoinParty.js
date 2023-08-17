import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { customAPI } from "../../customAPI";

const JoinParty = () => {
  const [carpoolData, setCarpoolData] = useState([]);
  const [taxiData, setTaxiData] = useState([]);

  const getMyParty = async () => {
    console.log("get my party");
    try {
      const response = await customAPI.get(`/members/participation-list/`, {});

      const myList = response.data;
      myList.map((item) => {
        if (item.type === "카풀") {
          setCarpoolData((prev) => prev.concat(item));
        } else if (item.type === "택시") {
          setTaxiData((prev) => prev.concat(item));
        }
      });
    } catch (err) {
      console.log("Faild to get Party Data", err);
    }
  };

  useEffect(() => {
    setCarpoolData([]);
    setTaxiData([]);
    getMyParty();
  }, []);

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
            <Link to="/Info/JoinParty">
              <strong>Share 후기</strong>
            </Link>
          </StyledText>
        </div>
      </LeftSection>
      <RightSection>
        <StyledHeading>참여 파티</StyledHeading>
        <CenteredContent>
          <StyledTable>
            {carpoolData.length !== 0 ? (
              <StyledTitleCell>
                <SellText>카풀</SellText>
                <StyledCell>
                  {carpoolData.map((item, id) => {
                    return (
                      <StyledRow key={id}>
                        <StyledCell>
                          <SellText>{item.startPoint}</SellText>
                          <SellText>{item.endPoint}</SellText>
                        </StyledCell>
                      </StyledRow>
                    );
                  })}
                </StyledCell>
              </StyledTitleCell>
            ) : null}

            {taxiData.length !== 0 ? (
              <StyledTitleCell>
                <SellText>택시</SellText>
                <StyledCell>
                  {taxiData.map((item, id) => {
                    return (
                      <StyledRow key={id}>
                        <StyledCell>
                          <SellText>{item.startPoint}</SellText>
                          <SellText>{item.endPoint}</SellText>
                        </StyledCell>
                      </StyledRow>
                    );
                  })}
                </StyledCell>
              </StyledTitleCell>
            ) : null}
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
  width: 100%;
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

export default JoinParty;
