import React from "react";
import styled from "styled-components";
import InfoNavBar from "../../components/InfoNavBar";
import { Outlet } from "react-router-dom";

const Info = () => {

  return (
    <StyledContainer>
      <LeftSection>
        <InfoNavBar />
      </LeftSection>
      <RightSection>
        <Outlet />
      </RightSection>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100vh;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 20px;
  padding: 20px;
`;

const RightSection = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  padding: 60px;
  background-color: #f9fbfc;
  border-left: 1px solid #ccc;
`;

export default Info;
