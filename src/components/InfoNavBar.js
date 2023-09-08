import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const InfoNavBar = () => {
  return (
    <StyledNavBar>
      <CustomNavLink to="/Info/Profile">
        <strong>내 프로필</strong>
      </CustomNavLink>

      <CustomNavLink to="/Info/MyParty">
        <strong>작성 글</strong>
      </CustomNavLink>

      <CustomNavLink to="/Info/JoinParty">
        <strong>Share 후기</strong>
      </CustomNavLink>
    </StyledNavBar>
  );
};

const StyledNavBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 40px;
  margin-right: 20px;
`;

const CustomNavLink = styled(Link)`
  font-size: 18px;
  text-decoration: none;
  color: black;
  padding: 10px;
  font-weight: bold;
  transition: all 0.3s ease;
  :hover {
    color: #0583f2;
  }

  @media (max-width: 1000px) {
    display: none;
  }
`;

const StyledHeading = styled.h1`
  text-align: left;
  padding-bottom: 50px;
`;

export default InfoNavBar;
