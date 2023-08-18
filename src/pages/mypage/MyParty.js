import { useState, useEffect } from "react";
import styled from "styled-components";
import { customAPI } from "../../customAPI";

const MyParty = () => {
  const [carpoolData, setCarpoolData] = useState([]);
  const [taxiData, setTaxiData] = useState([]);

  const getMyParty = async () => {
    console.log("get my party");
    try {
      const response = await customAPI.get(`/members/notice-list/`, {});

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
      <CenteredContent>
        <StyledHeading>작성 글</StyledHeading>
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
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100vh;
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
  background-color: #f4f8fe;
  border-left: none; /* 셀에서 왼쪽 테두리 제거 */
  border-right: none; /* 셀에서 오른쪽 테두리 제거 */
`;

const StyledTitleCell = styled.div`
  display: table-cell;
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  vertical-align: top; /* 셀 상단의 텍스트 정렬 */
  line-height: 1; /* 셀 높이를 줄여 텍스트를 위쪽에 가깝게 만듭니다 */
  border-left: none; /* 셀에서 왼쪽 테두리 제거 */
  border-right: none; /* 셀에서 오른쪽 테두리 제거 */
`;

const SellText = styled.p`
  text-decoration: none;
  font-weight: bold;
  padding: 20px;
`;

export default MyParty;
