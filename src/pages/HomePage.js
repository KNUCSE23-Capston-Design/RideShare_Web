import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as CarpoolImg } from "../assets/img/carpool2.svg";

const Home = () => {
    return (
        <>
            <MainDiv>
                <MainImg />
                <PhraseWrapper>
                    <MainPhrase>쉽고 간편한 차량 공유 서비스</MainPhrase>
                    <MainPhrase style={{ marginLeft: "40px" }}>RideShare</MainPhrase>
                </PhraseWrapper>

                <DestinationInput type="text" name="inputName" placeholder="   목적지를 입력하시오" />
            </MainDiv>

            {/* <footer>hello</footer> */}
        </>
    );
};

export default Home;

const MainDiv = styled.div`
    position: relative;
    width: 100%;
    height: calc(100vh - 78.6px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #F4F8FE;
`;

const PhraseWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-left: 14vw;
    margin-bottom: 60vh;
    width: 45vw;
    z-index: 1;

    @media (max-width: 800px) {       //브라우저 크기 조절시 사라짐
        display: none;
      }
`;

const DestinationInput = styled.input`
    width: 600px;
    height: 50px;
    margin-right: 13vw;
    margin-bottom: 50vh;
    border-radius: 15px;
    border: 2px solid #0583f2;
    z-index: 1;

    @media (max-width: 800px) {       //브라우저 크기 조절시 사라짐
        display: none;
      }
`;

const MainPhrase = styled.h1`
    margin-bottom: 10px;
    font-size: 2vw;
`;

const MainImg = styled(CarpoolImg)`
    position: absolute;
    width: 45vw;
    margin-left: 100px;

    @media (max-width: 780px) {       //브라우저 크기 조절시 페이지 가득채움
        width: 100%;
        height: 100%;
        margin: 0;
      }
`;
