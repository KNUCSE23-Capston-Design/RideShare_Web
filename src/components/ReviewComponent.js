import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useResetRecoilState } from "recoil";
import { ReviewWritingState } from "../atoms";
import { customAPI } from "../customAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewComponent = (props) => {
  const partyId = props.pid;
  const resetCarpoolWriting = useResetRecoilState(ReviewWritingState);
  const [top, setTop] = useState(
    window.scrollY + window.innerHeight / 2 + "px"
  );

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setTop(scrollTop + window.innerHeight / 2 + "px");
  };

  const [profileData, setProfileData] = useState({
    id: "",
    nickname: "",
    score: "",
  });

  const showPopupMessage = () => {
    toast.success("후기가 등록 되었습니다.", {
      autoClose: 1000,
    });
  };

  const handleClose = () => {
    resetCarpoolWriting();
  };

  const getProfile = async () => {
    try {
      const data = customAPI.get(`/review/pid/${partyId}`);

      console.log(data);

      data.then((result) => {
        setProfileData({
          id: result.data.id,
          nickname: result.data.nickname,
          score: result.data.score,
        });
      });

      console.log(profileData);
    } catch (err) {
      console.log(err);
    }
  };

  const sendReview = async (sc) => {
    try {
      const response = customAPI.post(`/review/pid/${partyId}`, {
        score: sc,
      });

      console.log(response);

      response.then((result) => {
        if (result.status === 200) {
          showPopupMessage();
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <Container top={top}>
        <Title>후기 남기기</Title>
        <InputContainer>
          <InputLabel>{profileData.nickname}님의 파티</InputLabel>
          <InputLabel>아이디 : {profileData.id}</InputLabel>
          <InputLabel>
            점수 : {profileData.score === null ? "0" : profileData.score}점{" "}
          </InputLabel>
        </InputContainer>
        <ReviewButtonContainer>
          <ReviewButton
            onClick={() => {
              sendReview("100");
            }}
          >
            좋았어요
          </ReviewButton>
          <ReviewButton
            onClick={() => {
              sendReview("50");
            }}
          >
            보통이에요
          </ReviewButton>
          <ReviewButton
            onClick={() => {
              sendReview("0");
            }}
          >
            싫었어요
          </ReviewButton>
        </ReviewButtonContainer>
        <ButtonContainer>
          <CloseButton onClick={handleClose}>닫기</CloseButton>
        </ButtonContainer>
      </Container>
      <ToastContainer />
    </>
  );
};

export default ReviewComponent;

const Container = styled.div`
  width: 50vw;
  min-width: 300px;
  max-width: 600px;

  position: absolute;
  top: ${(props) => props.top};
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  border: 2px solid #0583f2;
  overflow: auto;
  z-index: 1000;
  font-family: "Noto Sans KR", sans-serif;
`;

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 20px;
  margin-left: 30px;
  margin-top: 20px;
  color: #0583f2;
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
  margin-left: 30px;
`;

const InputLabel = styled.div`
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ReviewButtonContainer = styled.div`
  margin: 10px 10px 10px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReviewButton = styled.button`
  padding: 5px 20px 5px 20px;
  margin: 10px;
  font-size: 19px;
  color: #0583f2;
  font-weight: bold;
  border: 2px solid #0583f2;
  border-radius: 25px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  :hover {
    color: #ffffff;
    border: 2px solid #0583f2;
    background-color: #0583f2;
  }

  @media screen and (max-width: 480) {
    margin-left: 0;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 0px;
  transform: translate(-15%, -50%);
`;

const CloseButton = styled.button`
  width: 50px;
  height: 40px;
  margin-left: 30px;
  border-radius: 5px;
  font-weight: bold;
  border: none;
  cursor: pointer; //마우스 포인터 변화
  color : 

  background-color: #fff;
  font-size: 16px;
  font-weight: bold;
  color: #0583f2;

  border: none;
  border-radius: 10px;

  :hover {
    background-color: whitesmoke;
  }

`;
