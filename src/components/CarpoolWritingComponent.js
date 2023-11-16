import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useResetRecoilState } from "recoil";
import { CarpoolWritingState } from "../atoms";
import { customAPI } from "../customAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CarpoolWritingComponent = () => {
  const resetCarpoolWriting = useResetRecoilState(CarpoolWritingState);
  const [showPostcode, setShowPostcode] = useState(false);
  const [top, setTop] = useState(
    window.scrollY + window.innerHeight / 2 + "px"
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setTop(scrollTop + window.innerHeight / 2 + "px"); // top 값을 문자열로 변경
  };

  const [carpoolData, setCarpoolData] = useState({
    type: "카풀",
    startPoint: "",
    startLat: "",
    startLng: "",
    endPoint: "",
    endLat: "",
    endLng: "",
    totalHeadcnt: 0,
    startDate: "",
    startTime: "",
    carNumber: "98가7654",
    content: "",
  });

  const showPopupMessage = () => {
    toast.success("등록 되었습니다.", {
      autoClose: 1000, // 자동 닫힘 지속 시간을 1초로 설정
      onClose: handleClose, // 토스트가 닫히면 글쓰기 창 닫기() 실행
    });
  };

  const handlePostcode = async (whatpoint) => {
    setIsPopupOpen(true);
    new window.daum.Postcode({
      oncomplete: async (data) => {
        // 사용자가 다음 우편번호 팝업에서 주소를 선택하면,
        // 선택한 주소로 시작점 입력 업데이트
        if (whatpoint === "startPoint") {
          setCarpoolData((prevState) => ({
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

              setCarpoolData((prevState) => ({
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
          setCarpoolData((prevState) => ({
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
              setCarpoolData((prevState) => ({
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
    resetCarpoolWriting();
  };

  const handleRegister = async () => {
    try {
      const response = await customAPI.post("/parties", {
        type: "카풀",
        startPoint: carpoolData.startPoint,
        startLat: carpoolData.startLat,
        startLng: carpoolData.startLng,
        endPoint: carpoolData.endPoint,
        endLat: carpoolData.endLat,
        endLng: carpoolData.endLng,
        totalHeadcnt: carpoolData.totalHeadcnt,
        startDate: carpoolData.startDate,
        startTime: carpoolData.startTime,
        carNumber: "98ga7654",
        content: "",
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Container top={top}>
        <Title>카풀 글쓰기</Title>
        <InputContainer>
          <InputLabel>출발지</InputLabel>
          <InputField
            type="text"
            value={carpoolData.startPoint}
            onClick={() => handlePostcode("startPoint")}
            readOnly
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>도착지</InputLabel>
          <InputField
            type="text"
            value={carpoolData.endPoint}
            onClick={() => handlePostcode("endPoint")}
            readOnly
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>최대인원</InputLabel>
          <InputField
            type="number"
            onChange={(e) => {
              setCarpoolData((prevState) => ({
                ...prevState,
                totalHeadcnt: parseInt(e.target.value, 10),
              }));
            }}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>날짜</InputLabel>
          <InputField
            type="date"
            onChange={(e) => {
              setCarpoolData((prevState) => ({
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
              setCarpoolData((prevState) => ({
                ...prevState,
                startTime: e.target.value,
              }));
            }}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>글 내용</InputLabel>
          <TextareaField
            onChange={(e) => {
              setCarpoolData((prevState) => ({
                ...prevState,
                content: e.target.value,
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

export default CarpoolWritingComponent;

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

const TextareaField = styled.textarea`
  width: 90%;
  height: 100px;
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
