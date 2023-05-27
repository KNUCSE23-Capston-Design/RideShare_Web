import React, { useState } from "react";
import styled from "styled-components";
import { useResetRecoilState } from "recoil";
import { TaxiWritingState } from "../atoms";

const TaxiWritingComponent = () => {
  const resetTaxiWriting = useResetRecoilState(TaxiWritingState);

  const handleClose = () => {
    resetTaxiWriting();
  };

  const handleRegister = () => {
    // 등록 클릭시 서버로 내용을 보내야함
  };

  return (
    <>
      <Container>
        <Title>택시 글쓰기</Title> {/* Added title */}
        <InputContainer>
          <InputLabel>출발지</InputLabel>
          <InputField type="text" />
        </InputContainer>
        <InputContainer>
          <InputLabel>도착지</InputLabel>
          <InputField type="text" />
        </InputContainer>
        <InputContainer>
          <InputLabel>최대인원</InputLabel>
          <InputField type="number" />
        </InputContainer>
        <InputContainer>
          <InputLabel>날짜</InputLabel>
          <InputField type="date" />
        </InputContainer>
        <InputContainer>
          <InputLabel>출발 시간</InputLabel>
          <InputField type="time" />
        </InputContainer>
        <ButtonContainer>
          <RegisterButton onClick={handleRegister}>등록</RegisterButton>
          <CloseButton onClick={handleClose}>취소</CloseButton>
        </ButtonContainer>
      </Container>
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  border: 1px solid black;
  overflow: auto;
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
