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
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  margin-left: 7vw;
  margin-right: 1vw;
`;

const RightSection = styled.div`
  flex: 5;
  margin-right: 20vw;

  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);
`;

export default Info;
