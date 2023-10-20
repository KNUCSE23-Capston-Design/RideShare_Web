import React, { useState, useEffect } from "react";
import { Container as MapDiv, Polyline } from "react-naver-maps";
import styled from "styled-components";
import AllListComponent from "../components/AllListComponent";
import ListComponent from "../components/ListComponent";
import MapComponent from "../components/MapComponent1";
import CarpoolWritingComponent from "../components/CarpoolWritingComponent";
import TaxiWritingComponent from "../components/TaxiWritingComponent";
import {
  showTaxiState,
  showCarpoolState,
  CarpoolWritingState,
  TaxiWritingState,
  isLoggedInState,
} from "../atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import taxiIcon from "../assets/icon/taxi.png";
import carIcon from "../assets/icon/car.png";

const Home = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const isCarpoolshow = useRecoilValue(showCarpoolState);
  const isTaxishow = useRecoilValue(showTaxiState);
  const [CarpoolWriting, setCarpoolWriting] =
    useRecoilState(CarpoolWritingState);
  const [TaxiWriting, setTaxiWriting] = useRecoilState(TaxiWritingState);

  const onClickButton = () => {
    setIsButtonClicked(!isButtonClicked);
  };

  const handleCarpoolButtonClick = () => {
    setCarpoolWriting(true);
    setTaxiWriting(false);
  };

  const handleTaxiButtonClick = () => {
    setCarpoolWriting(false);
    setTaxiWriting(true);
  };

  return (
    <MainDiv>
      <MainContentBox>
        {isButtonClicked ? (
          !isCarpoolshow && !isTaxishow ? (
            <AllListComponent style={{ zIndex: "999" }} />
          ) : (
            <ListComponent style={{ zIndex: "999" }} />
          )
        ) : null}
        <MapBox isButtonClicked={isButtonClicked}>
          <MapComponent />
          <ContentBox>
            {isButtonClicked ? (
              <SetListButton onClick={onClickButton}>
                목록 열기 &lt;
              </SetListButton>
            ) : (
              <SetListButton onClick={onClickButton}>
                목록 닫기 &gt;
              </SetListButton>
            )}

            <DestinationInput
              type="text"
              name="inputName"
              placeholder="목적지를 입력하시오"
            />
            {(!isCarpoolshow && !isTaxishow) || !isLoggedIn ? (
              <CarpoolButton style={{ visibility: "hidden" }}>
                카풀 글쓰기
              </CarpoolButton>
            ) : (
              isCarpoolshow &&
              isLoggedIn && (
                <CarpoolButton onClick={handleCarpoolButtonClick}>
                  카풀 글쓰기
                </CarpoolButton>
              )
            )}
            {!isCarpoolshow && !isTaxishow
              ? null
              : isTaxishow &&
                isLoggedIn && (
                  <TaxiButton onClick={handleTaxiButtonClick}>
                    택시 글쓰기
                  </TaxiButton>
                )}
          </ContentBox>
        </MapBox>
      </MainContentBox>
      {CarpoolWriting && <CarpoolWritingComponent />}
      {TaxiWriting && <TaxiWritingComponent />}
    </MainDiv>
  );
};

export default Home;

const MainDiv = styled.div`
  position: relative;
  display: flex;
`;

const MainContentBox = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapBox = styled(MapDiv)`
  height: calc(100vh - 90px);
  width: 100%;
  z-index: 1;
`;

const ContentBox = styled.div`
  margin-top: 10px;
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const DestinationInput = styled.input`
  width: 500px;
  height: 40px;
  text-indent: 20px;
  font-size: 16px;
  font-family: "Noto Sans KR", sans-serif;

  border-radius: 15px;
  border: 2px solid #0583f2;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  z-index: 999;

  :focus {
    outline: none;
    border: 2px solid #0583f2;
  }
`;

const SetListButton = styled.button`
  padding: 10px;
  margin-left: 10px;

  background-color: #fff;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);

  font-family: "Noto Sans KR", sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #0583f2;

  border: none;
  border-radius: 10px;
  z-index: 999;

  :hover {
    background-color: whitesmoke;
  }
`;

const CarpoolButton = styled.button`
  padding: 10px;
  margin-right: 10px;

  background-color: #fff;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);

  font-family: "Noto Sans KR", sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #0583f2;

  border: none;
  border-radius: 10px;
  z-index: 999;

  :hover {
    background-color: whitesmoke;
  }
  cursor: pointer;
`;

const TaxiButton = styled.button`
  padding: 10px;
  margin-right: 10px;

  background-color: #fff;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);

  font-family: "Noto Sans KR", sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #0583f2;

  border: none;
  border-radius: 10px;
  z-index: 999;

  :hover {
    background-color: whitesmoke;
  }
  cursor: pointer;
`;
