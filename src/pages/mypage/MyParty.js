import { useState, useEffect } from "react";
import styled from "styled-components";
import { customAPI } from "../../customAPI";
import taxiIcon from "./../../assets/icon/taxi.png";
import carIcon from "./../../assets/icon/car.png";
import {
  CarpoolWritingState,
  TaxiWritingState,
  showCarpoolState,
  showTaxiState,
} from "../../atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import CarpoolWritingComponent from "../../components/CarpoolWritingComponent";
import TaxiWritingComponent from "../../components/TaxiWritingComponent";

const MyParty = () => {
  const [partyData, setPartyData] = useState([]);
  const [CarpoolWriting, setCarpoolWriting] =
    useRecoilState(CarpoolWritingState);
  const [TaxiWriting, setTaxiWriting] = useRecoilState(TaxiWritingState);
  const showCarpool = useRecoilValue(showCarpoolState);
  const showTaxi = useRecoilValue(showTaxiState);

  const getMyParty = async () => {
    console.log("get my party");
    try {
      const response = await customAPI.get(`/members/notice-list/`, {});

      const myList = response.data;
      myList.map((item) => {
        setPartyData((prev) => prev.concat(item));
      });

      console.log(partyData);
    } catch (err) {
      console.log("Faild to get Party Data", err);
    }
  };

  const handleCarpoolButtonClick = () => {
    setCarpoolWriting(true);
    setTaxiWriting(false);
  };

  const handleTaxiButtonClick = () => {
    setCarpoolWriting(false);
    setTaxiWriting(true);
  };

  const handleDeleteButtonClick = async (id) => {
    try {
      const response = await customAPI.delete(`/parties/${id}`);

      if (response.status === 200) {
        console.log("successfully deleted");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setPartyData([]);
    getMyParty();
  }, []);

  return (
    <StyledContainer>
      <CenteredContent>
        <ContentTitle>
          <ContentTitleHeading>나의 파티</ContentTitleHeading>
        </ContentTitle>
        <MainBox>
          {partyData.length !== 0
            ? partyData.map((item, id) => {
                return (
                  <div key={id}>
                    {item.type === "카풀" ? (
                      <ContentBox>
                        <img
                          src={carIcon}
                          alt=""
                          style={{ width: "35px", margin: "0 15px" }}
                        ></img>

                        <LocationBox>
                          <h3 style={{ marginTop: "5px" }}>
                            출발 : {item.startPoint}
                          </h3>
                          <h3 style={{ marginTop: "5px" }}>
                            도착 : {item.endPoint}
                          </h3>
                          <TimeBox>
                            <TimeH3>{item.startDate}</TimeH3>
                            <TimeH3>{item.startTime}</TimeH3>
                          </TimeBox>
                        </LocationBox>

                        <HeadCnt>
                          {" "}
                          {item.currentHeadcnt}/{item.totalHeadcnt}
                        </HeadCnt>
                        <ButtonBox>
                          <StyledButton onClick={handleCarpoolButtonClick}>
                            수정
                          </StyledButton>
                          <StyledButton
                            onClick={() => handleDeleteButtonClick(item.pid)}
                            style={{ marginBottom: "0" }}
                          >
                            삭제
                          </StyledButton>
                        </ButtonBox>
                      </ContentBox>
                    ) : (
                      <ContentBox style={{ border: "1px solid #FFCC00" }}>
                        <img
                          src={taxiIcon}
                          alt=""
                          style={{ width: "35px", margin: "0 15px" }}
                        ></img>

                        <LocationBox>
                          <h3>출발 : {item.startPoint}</h3>
                          <h3>도착 : {item.endPoint}</h3>
                          <TimeBox>
                            <TimeH3>{item.startDate}</TimeH3>
                            <TimeH3>{item.startTime}</TimeH3>
                          </TimeBox>
                        </LocationBox>
                        <HeadCnt>
                          {item.currentHeadcnt}/{item.totalHeadcnt}
                        </HeadCnt>
                        <ButtonBox>
                          <StyledButton onClick={handleTaxiButtonClick}>
                            수정
                          </StyledButton>
                          <StyledButton
                            onClick={() => handleDeleteButtonClick(item.pid)}
                            style={{ marginBottom: "0" }}
                          >
                            삭제
                          </StyledButton>
                        </ButtonBox>
                      </ContentBox>
                    )}
                  </div>
                );
              })
            : null}
        </MainBox>
      </CenteredContent>
      {CarpoolWriting && <CarpoolWritingComponent />}
      {TaxiWriting && <TaxiWritingComponent />}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100vh;
`;

const ContentTitle = styled.div`
  width: 100%;
  border-bottom: 2px solid black;
`;

const ContentTitleHeading = styled.h2`
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

const MainBox = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContentBox = styled.div`
  width: 100%;
  min-height: 100px;
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #0583f2;
  border-radius: 30px;
`;

const CarPoolTypeHeader = styled.h3`
  margin: 0 15px;
  color: #0583f2;
`;

const TaxiTypeHeader = styled.h3`
  margin: 0 15px;
  color: yellow;
`;

const LocationBox = styled.div`
  margin: 0 15px;
  display: flex;
  flex-direction: column;
  flex: 5;
`;

const TimeBox = styled.div`
  display: flex;
  margin-top: 10px;
`;

const TimeH3 = styled.h3`
  padding-right: 10px;
`;

const HeadCnt = styled.h3`
  flex: 1;
`;

const ButtonBox = styled.div`
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StyledButton = styled.button`
  width: 50px;
  margin: 0 0 5px 0;
  background-color: #ffffff;
  padding: 5px;
  border: 2px solid;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
`;

export default MyParty;
