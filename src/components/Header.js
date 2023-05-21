import React from "react";
import { Link } from "react-router-dom";
import { Container as MapDiv } from "react-naver-maps";
import Mappage from "../pages/Mappage";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { carpoolDataState, taxiDataState } from "../atoms";
import { ReactComponent as Logo } from "../assets/logo/mainlogo.svg";
import styled from "styled-components";

const MarkerDataContainer = () => {
  const carpoolMarkerData = useRecoilValue(carpoolDataState);
  const taxiMarkerData = useRecoilValue(taxiDataState);

  return (
    <Mappage CarpoolMarkerData={carpoolMarkerData} TaxiMarkerData={taxiMarkerData} />
  );
};

const Header = () => {
  const resetTaxiMarkerData = useResetRecoilState(taxiDataState); 
  const resetCarpoolMarkerData = useResetRecoilState(carpoolDataState); 

  const handleHomeClick = () => { //홈 버튼 클릭시
    resetCarpoolMarkerData(); // 카풀마커데이터 리셋
    resetTaxiMarkerData(); // 택시마커데이터 리셋
  };
  const handleCarpoolClick = () => {
    resetTaxiMarkerData(); // 카풀 버튼 클릭시 택시마커데이터 리셋
  };
  const handleTaxiClick = () => {
    resetCarpoolMarkerData(); // 택시 버튼 클릭시 카풀마커데이터 리셋
  };
  
  return (
        <StyledHeader>
            <Link to="/" onClick={handleHomeClick}>
                <MainLogo />
            </Link>
            <StyledNav>
                <NavLists>
                    <NavItem>
                        <NavLink to="/Info">내 정보</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/Login">로그인</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/SignUp">회원가입</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/carpool" onClick={handleCarpoolClick}>카풀</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/Taxi" onClick={handleTaxiClick}>택시</NavLink>
                    </NavItem>
                </NavLists>
            </StyledNav>
 <MapDiv style={{ width: "100%", height: "600px", position: "relative" }}>
        <MarkerDataContainer />
      </MapDiv>
        </StyledHeader>
    );
};

export default Header;
  
  const MainLogo = styled(Logo)`
    width: 140px;
    height: 50px;
    margin-top: 14px;
`;

const StyledHeader = styled.header`
    display: flex;
    justify-content: center;
    margin: 0 10px 9px 10px;
    font-family: "Noto Sans KR", sans-serif;
`;

const StyledNav = styled.nav`
    display: flex;
    align-items: center;
`;

const NavLists = styled.ul`
    margin: 14px 0 0 60px;
    list-style: none;
    display: flex;
`;

const NavItem = styled.li`
    list-style: none;
    margin: 10px;
`;

const NavLink = styled(Link)`
    text-decoration: none;
    color: black;
    transition: all 0.5s ease;
    :hover {
        color: #0583f2;
    }
`;
