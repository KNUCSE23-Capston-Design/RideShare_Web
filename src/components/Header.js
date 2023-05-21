import React from "react";
import { Link } from "react-router-dom";
import { Container as MapDiv } from "react-naver-maps";
import { useRecoilState, useResetRecoilState } from "recoil";
import { carpoolDataState, taxiDataState } from "../atoms";
import { ReactComponent as Logo } from "../assets/logo/mainlogo.svg";
import styled from "styled-components";

const TaximarkerData = [
    { name: "TaxiLocation 1", latitude: 37.8751, longitude: 127.7464 },
    { name: "TaxiLocation 2", latitude: 37.8635, longitude: 127.7316 },
    { name: "TaxiLocation 3", latitude: 37.8649, longitude: 127.7411 },
];


const CarpoolmarkerData = [
  { name: "CarpoolLocation 1", latitude: 37.8851, longitude: 127.7364 },
  { name: "CarpoolLocation 2", latitude: 37.8735, longitude: 127.7416 },
  { name: "CarpoolLocation 3", latitude: 37.8749, longitude: 127.7311 },
];


const Header = () => {
  const resetTaxiMarkerData = useResetRecoilState(taxiDataState); 
  const resetCarpoolMarkerData = useResetRecoilState(carpoolDataState);
  const [carpoolData, setCarpoolData] = useRecoilState(carpoolDataState);
  const [taxiData, setTaxiData] = useRecoilState(taxiDataState);

  const handleHomeClick = () => { //홈 버튼 클릭시
    resetCarpoolMarkerData(); // 카풀마커데이터 리셋
    resetTaxiMarkerData(); // 택시마커데이터 리셋
  };
  const handleCarpoolClick = () => {
    resetTaxiMarkerData(); // 카풀 버튼 클릭시 택시마커데이터 리셋
    setCarpoolData(CarpoolmarkerData);
  };
  const handleTaxiClick = () => {
    resetCarpoolMarkerData(); // 택시 버튼 클릭시 카풀마커데이터 리셋
    setTaxiData(TaximarkerData);
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
                        <NavLink to="/MapPage" onClick={handleCarpoolClick}>카풀</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/MapPage" onClick={handleTaxiClick}>택시</NavLink>
                    </NavItem>
                </NavLists>
            </StyledNav>
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
