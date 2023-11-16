import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useResetRecoilState } from "recoil";
import { TaxiWritingState } from "../atoms";
import { customAPI } from "../customAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaxiWritingComponent = () => {
  const resetTaxiWriting = useResetRecoilState(TaxiWritingState);
  const [showPostcode, setShowPostcode] = useState(false);
  const [top, setTop] = useState(
    window.scrollY + window.innerHeight / 2 + "px"
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setTop(scrollTop + window.innerHeight / 2 + "px"); // top 값을 문자열로 변경
  };

  const [taxiData, setTaxiData] = useState({
    type: "택시",
    startPoint: "",
    startLat: "",
    startLng: "",
    endPoint: "",
    endLat: "",
    endLng: "",
    totalHeadcnt: 0,
    startDate: "",
    startTime: "",
  });

  const showPopupMessage = () => {
    toast.success("등록 되었습니다.", {
      autoClose: 1000,
      onClose: handleClose,
    });
  };

  const handlePostcode = async (whatpoint) => {
    setIsPopupOpen(true);
    new window.daum.Postcode({
      oncomplete: async (data) => {
        // 사용자가 다음 우편번호 팝업에서 주소를 선택하면,
        // 선택한 input란이 출발지 이면 출발지 주소 업데이트
        if (whatpoint === "startPoint") {
          setTaxiData((prevState) => ({
            ...prevState,
            startPoint: data.address,
          }));

          // 카카오 맵 API를 사용하여 주소의 위도 및 경도를 가져옵니다
          try {
            const response = await customAPI.get(
              "https://dapi.kakao.com/v2/local/search/address.json",
              {
                params: {
                  query: data.address,
                },
              }
            );

            const { documents } = response.data;
            if (documents.length > 0) {
              const { y: lat, x: lng } = documents[0].address;
              console.log(lat, lng);
              setTaxiData((prevState) => ({
                ...prevState,
                startLat: lat,
                startLng: lng,
              }));
            } else {
              console.log("Failed to get latitude and longitude.");
            }
          } catch (error) {
            console.log("Error fetching latitude and longitude:", error);
          }

          // 선택한 input란이 도착지 이면 도착지 주소 업데이트
        } else if (whatpoint === "endPoint") {
          setTaxiData((prevState) => ({
            ...prevState,
            endPoint: data.address,
          }));

          try {
            const response = await customAPI.get(
              "https://dapi.kakao.com/v2/local/search/address.json",
              {
                params: {
                  query: data.address,
                },
              }
            );

            const { documents } = response.data;
            if (documents.length > 0) {
              const { y: lat, x: lng } = documents[0].address;
              console.log(lat, lng);
              setTaxiData((prevState) => ({
                ...prevState,
                endLat: lat,
                endLng: lng,
              }));
            } else {
              console.log("Failed to get latitude and longitude.");
            }
          } catch (error) {
            console.log("Error fetching latitude and longitude:", error);
          }
        }

        // 팝업 숨기기
        setShowPostcode(false);
      },
      onsearch: (query) => {
        // 팝업 열기
        setShowPostcode(true);
      },
      onclose: () => {
        // 팝업이 닫힐 때 실행되는 콜백
        setIsPopupOpen(false);
      },
    }).open();
  };

  const handleClose = () => {
    resetTaxiWriting();
  };

  const handleRegister = async () => {
    // 등록 클릭시 서버로 내용을 보내야함
    try {
      const response = await customAPI.post("/parties", {
        type: "택시",
        startPoint: taxiData.startPoint,
        startLat: taxiData.startLat,
        startLng: taxiData.startLng,
        endPoint: taxiData.endPoint,
        endLat: taxiData.endLat,
        endLng: taxiData.endLng,
        totalHeadcnt: taxiData.totalHeadcnt,
        startDate: taxiData.startDate,
        startTime: taxiData.startTime,
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("POST request was successful");
        showPopupMessage();
      } else {
        console.log("POST request failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 컴포넌트가 마운트될 때 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Container top={top}>
        <Title>택시 글쓰기</Title> {/* Added title */}
        <InputContainer>
          <InputLabel>출발지</InputLabel>
          <InputField
            type="text"
            value={taxiData.startPoint}
            onClick={() => handlePostcode("startPoint")} // 입력을 클릭하면 다음 우편번호 팝업을 엽니다.
            readOnly
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>도착지</InputLabel>
          <InputField
            type="text"
            value={taxiData.endPoint}
            onClick={() => handlePostcode("endPoint")}
            readOnly
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>최대인원</InputLabel>
          <InputField
            type="number"
            onChange={(e) => {
              setTaxiData((prevState) => ({
                ...prevState,
                totalHeadcnt: e.target.value,
              }));
            }}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>날짜</InputLabel>
          <InputField
            type="date"
            onChange={(e) => {
              setTaxiData((prevState) => ({
                ...prevState,
                startDate: e.target.value,
              }));
            }}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>출발 시간</InputLabel>
          <InputField
            type="time"
            onChange={(e) => {
              setTaxiData((prevState) => ({
                ...prevState,
                startTime: e.target.value,
              }));
            }}
          />
        </InputContainer>
        <ButtonContainer>
          <RegisterButton onClick={handleRegister}>등록</RegisterButton>
          <CloseButton onClick={handleClose}>취소</CloseButton>
        </ButtonContainer>
      </Container>
      <ToastContainer />
      {isPopupOpen && <BlurBackground />}
    </>
  );
};

export default TaxiWritingComponent;

const Container = styled.div`
  width: 50vw;
  min-width: 300px;
  max-width: 600px;
  height: 65vh;
  position: absolute;
  top: ${(props) => props.top};
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  border: 1px solid black;
  overflow: auto;
  z-index: 1000;
`;

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-top: 10px;
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
  margin-left: 30px;
`;

const InputLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  width: 90%;
  height: 25px;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 5px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 0px;
  transform: translate(-15%, -50%);
`;

const RegisterButton = styled.button`
  width: 60px;
  height: 30px;
  margin-right: 10px;
  border-radius: 5px;
  font-weight: bold;
  color: #0583f2;
  background-color: #a7d1f7;
  border: none;
  cursor: pointer; //마우스 포인터 변화
`;

const CloseButton = styled.button`
  width: 40px;
  height: 30px;
  border-radius: 5px;
  font-weight: bold;
  border: none;
  cursor: pointer; //마우스 포인터 변화
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
