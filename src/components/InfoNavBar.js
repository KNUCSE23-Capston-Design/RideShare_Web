import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const InfoNavBar = () => {
    return (
        <StyledNavBar>
            <StyledHeading>마이페이지</StyledHeading>
            <StyledText>
                <Link to="/Info/Profile">
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
        </StyledNavBar>
    );
};

const StyledNavBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px;
  padding: 20px;
`;

const StyledText = styled.p`
  text-decoration: none;
  font-weight: bold;
  padding: 5px;
`;

const StyledHeading = styled.h1`
  text-align: left;
  padding-bottom: 50px;
`;

export default InfoNavBar;
