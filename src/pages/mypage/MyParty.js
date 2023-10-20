import { useState, useEffect } from "react";
import styled from "styled-components";
import { customAPI } from "../../customAPI";
import taxiIcon from "./../../assets/icon/taxi.png";
import carIcon from "./../../assets/icon/car.png";
import { Container as MapDiv, Polyline } from "react-naver-maps";
import MapComponent from "../../components/UserMapComponent";
import {
  CarpoolWritingState,
  TaxiWritingState,
  showCarpoolState,
  showTaxiState,
  isChatOnState,
} from "../../atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import CarpoolWritingComponent from "../../components/CarpoolWritingComponent";
import TaxiWritingComponent from "../../components/TaxiWritingComponent";
import ChatRoom from "../../pages/Chat.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyParty = () => {
  const [partyData, setPartyData] = useState([]);
  const [CarpoolWriting, setCarpoolWriting] =
    useRecoilState(CarpoolWritingState);
  const [TaxiWriting, setTaxiWriting] = useRecoilState(TaxiWritingState);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [item, setItem] = useState([]);
  const [top, setTop] = useState(
    window.scrollY + window.innerHeight / 2 + "px"
  );
  const [isChatOn, setIsChatOn] = useRecoilState(isChatOnState);

  const handleChatButtonClicked = (item) => {
    setItem(item);
    setIsChatOn(true);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setTop(scrollTop + window.innerHeight / 2 + "px"); // top 값을 문자열로 변경
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    if (isMapOpen === true) {
      window.removeEventListener("scroll", handleScroll);
    }

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMapOpen]);

  const showPopupMessage = () => {
    toast.success("삭제 되었습니다.", {
      autoClose: 900, // 자동 닫힘 지속 시간을 1초로 설정
      onClose: handleClose, // 토스트가 닫히면 글쓰기 창 닫기() 실행
    });
  };

  const handleClose = () => {
    window.location.reload();
  };

  const getMyParty = async () => {
    // console.log("get my party");
    try {
      const response = await customAPI.get(`/members/notice-list/`, {});

      const myList = response.data;
      myList.map((item) => {
        setPartyData((prev) => prev.concat(item));
      });

      // console.log(partyData);
    } catch (err) {
      console.log("Faild to get Party Data", err);
    }
  };

  const handleCarpoolButtonClick = () => {
    handleScroll();
    setCarpoolWriting(true);
    setTaxiWriting(false);
  };

  const handleTaxiButtonClick = () => {
    handleScroll();
    setCarpoolWriting(false);
    setTaxiWriting(true);
  };

  const handleDeleteButtonClick = async (id) => {
    try {
      const response = await customAPI.delete(`/parties/${id}`);

      if (response.status === 200) {
        console.log("successfully deleted");
      }

      showPopupMessage();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMapViewClick = async (item) => {
    setIsMapOpen(true);
    setItem(item);
  };

  const handleCloseMapClick = async (item) => {
    setIsMapOpen(false);
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
                          {item.currentHeadcnt}/{item.totalHeadcnt}
                        </HeadCnt>
                        <ButtonBox>
                          <StyledButton
                            onClick={() => handleChatButtonClicked(item)}
                          >
                            채팅
                          </StyledButton>
                          <StyledButton
                            onClick={() => handleMapViewClick(item)}
                          >
                            지도 보기
                          </StyledButton>
                          <StyledButton onClick={handleCarpoolButtonClick}>
                            수정
                          </StyledButton>
                          <StyledButton
                            onClick={() => handleDeleteButtonClick(item.pid)}
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
                          <StyledButton
                            onClick={() => handleChatButtonClicked(item)}
                          >
                            채팅
                          </StyledButton>
                          <StyledButton
                            onClick={() => handleMapViewClick(item)}
                          >
                            지도 보기
                          </StyledButton>
                          <StyledButton onClick={handleTaxiButtonClick}>
                            수정
                          </StyledButton>
                          <StyledButton
                            onClick={() => handleDeleteButtonClick(item.pid)}
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
      {isChatOn && <ChatRoom item={item} />}
      <ToastContainer />
      {isMapOpen && (
        <div
          style={{
            top: `${top}`,
            position: "absolute",
            left: "42%",
          }}
        >
          <MapBox>
            <MapComponent item={item} />
          </MapBox>
          <CloseMapButton onClick={handleCloseMapClick}>닫기</CloseMapButton>
          <BlurBackground />
        </div>
      )}
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
  flex: 1;
`;

const StyledButton = styled.button`
  width: 50px;
  margin-right: 10px;
  background-color: #ffffff;
  padding: 5px;
  border: 2px solid;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;

  :hover {
    background-color: whitesmoke;
  }
`;

const MapBox = styled(MapDiv)`
  width: 50vw;
  min-width: 300px;
  height: 65vh;
  position: absolute;
  top: ${(props) => props.top};
  // top: 400px;
  left: 15%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  border: 1px solid black;
  overflow: auto;
  z-index: 1000;
`;

const CloseMapButton = styled.button`
  padding: 10px;
  margin-left: 10px;
  position: absolute;
  z-index: 1000;
  top: -290px;
  left: 55%;

  background-color: #fff;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);

  font-family: "Noto Sans KR", sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #0583f2;

  border: none;
  border-radius: 10px;

  :hover {
    background-color: whitesmoke;
  }
`;

const BlurBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px); /* 블러 처리 스타일 */
  z-index: 999;
`;

export default MyParty;
