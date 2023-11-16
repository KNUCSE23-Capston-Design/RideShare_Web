import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  showCarpoolState,
  showTaxiState,
  carpoolDataState,
  taxiDataState,
  isLoggedInState,
} from "../atoms";
import { ReactComponent as Logo } from "../assets/logo/Logo_word.svg";
import { removeCookieToken } from "../Cookies";
import styled from "styled-components";

const Header = () => {
  const resetTaxiMarkerData = useResetRecoilState(taxiDataState);
  const resetCarpoolMarkerData = useResetRecoilState(carpoolDataState);
  const resetshowCarpool = useResetRecoilState(showCarpoolState);
  const resetshowTaxi = useResetRecoilState(showTaxiState);
  const [showCarpool, setshowCarpool] = useRecoilState(showCarpoolState);
  const [showTaxi, setshowTaxi] = useRecoilState(showTaxiState);
  const [carpoolData, setCarpoolData] = useRecoilState(carpoolDataState);
  const [taxiData, setTaxiData] = useRecoilState(taxiDataState);
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");

  /** ------------------------------------------------------------------ */
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [logoMargin, setLogoMargin] = useState("270px");
  const [loginMargin, setLoginMargin] = useState("270px");
  // 반응형 헤더 네비게이션 버튼
  const [isNavActive, setIsNavActive] = useState(false);

  const checkLogin = () => {
    if (!accessToken) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleResize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 1200) {
      setLogoMargin("40px");
      setLoginMargin("30px");
    } else {
      setLogoMargin("20vw");
      setLoginMargin("20vw");
    }

    if (windowWidth > 1000) {
      setIsNavActive(false);
    }
  };

  //브라우저의 크기 변화시 로고와 로그인 자연스럽게 변화
  useEffect(() => {
    checkLogin();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCarpoolData, setTaxiData]);

  const handleHomeClick = () => {
    resetCarpoolMarkerData();
    resetTaxiMarkerData();
    setshowCarpool(false);
    setshowTaxi(false);
  };

  const handleCarpoolClick = () => {
    setIsNavActive(!isNavActive);
    resetTaxiMarkerData();
    resetshowTaxi();
    setshowCarpool(true);
  };

  const handleTaxiClick = () => {
    setIsNavActive(!isNavActive);
    resetCarpoolMarkerData();
    resetshowCarpool();
    setshowTaxi(true);
  };

  const handleLogoutClick = () => {
    removeCookieToken();
    sessionStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleButton = () => {
    setIsNavActive(!isNavActive);
  };

  return (
    <>
      <StyledHeader>
        <Link to="/" onClick={handleHomeClick}>
          <MainLogo margin={logoMargin} />
        </Link>
        <StyledNav>
          <NavLists>
            <NavGroup>
              <NavItem>
                <CustomNavLink to="/" onClick={handleCarpoolClick}>
                  Carpool
                </CustomNavLink>
              </NavItem>
              <Divider />
              <NavItem>
                <CustomNavLink to="/" onClick={handleTaxiClick}>
                  Taxi
                </CustomNavLink>
              </NavItem>
            </NavGroup>
          </NavLists>
        </StyledNav>
        <NavLists>
          {isLoggedIn ? (
            <NavGroup>
              <NavItem>
                <CustomNavLink to="/Info/Profile">MyPage</CustomNavLink>
              </NavItem>
              <CustomNavItem>
                <LoginButton
                  to="/"
                  onClick={handleLogoutClick}
                  margin={loginMargin}
                >
                  Logout
                </LoginButton>
              </CustomNavItem>
            </NavGroup>
          ) : (
            <CustomNavItem>
              <LoginButton to="/Login" margin={loginMargin}>
                Login
              </LoginButton>
            </CustomNavItem>
          )}
        </NavLists>
        <ToggleButton
          className={isNavActive ? "active" : ""}
          onClick={toggleButton}
        >
          <Bar />
          <Bar />
          <Bar />
        </ToggleButton>
      </StyledHeader>
      <MobileNavDiv isNavActive={isNavActive}>
        <MobileNavList isNavActive={isNavActive}>
          <MobileNavLink
            to="/MapPage"
            onClick={handleCarpoolClick}
            isNavActive={isNavActive}
          >
            Carpool
          </MobileNavLink>
          <MobileNavLink
            to="/MapPage"
            onClick={handleTaxiClick}
            isNavActive={isNavActive}
          >
            Taxi
          </MobileNavLink>
          {isLoggedIn ? (
            <MobileNavLink
              to="/Info/Profile"
              onClick={handleTaxiClick}
              isNavActive={isNavActive}
            >
              MyPage
            </MobileNavLink>
          ) : null}
        </MobileNavList>
      </MobileNavDiv>
    </>
  );
};

export default Header;

const MainLogo = styled(Logo)`
  padding: 0;
  width: 140px;
  height: 100%;
  padding-right: 34px;
  margin-left: ${(props) => props.margin};
  transition: all 0.5s ease;

  media screen and (max-width : 480px) {
    padding-right: 0;
  }
`;

const StyledHeader = styled.header`
  height : 50px;
  display: flex;
  justify-content: space-between;
  padding 20px 0;
  font-family: "Noto Sans KR", sans-serif;
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: auto;

  media screen and (max-width : 480px) {
    display: none;
  }
`;

const NavLists = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
`;

const NavItem = styled.li`
  list-style: none;
  margin-right: 10px;
  margin-left: 10px;

  @media (max-width: 480px) {
    margin-right: 0px;
    margin-left: 0px;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #ccc;
  margin: 0 10px;

  @media (max-width: 1000px) {
    display: none;
  }
`;

const CustomNavItem = styled.li`
  margin-left: 30px;

  @media (max-width: 1000px) {
    margin-left: 0;
  }
`;

const CustomNavLink = styled(Link)`
  font-size: 19px;
  text-decoration: none;
  color: black;
  font-weight: bold;
  transition: all 0.3s ease;
  :hover {
    color: #0583f2;
  }

  @media (max-width: 1000px) {
    display: none;
  }
`;

const LoginButton = styled(Link)`
  width: 100px;
  padding: 5px 20px 9px 20px;
  font-size: 19px;
  text-decoration: none;
  color: #0583f2;
  font-weight: bold;
  border: 2px solid #0583f2;
  border-radius: 25px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  margin-right: ${(props) => props.margin};
  :hover {
    color: #ffffff;
    border: 2px solid #0583f2;
    background-color: #0583f2;
  }

  @media screen and (max-width: 480) {
    margin-left: 0;
  }
`;

const ToggleButton = styled.button`
  display: none;

  @media screen and (max-width: 1000px) {
    margin-right: 30px;
    // margin-top: 3px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
`;

const Bar = styled.span`
  width: 30px;
  height: 3px;
  background-color: black;
  margin: 3px 0;
  transition: transform 0.3s, opacity 0.3s;

  &:nth-child(1) {
    ${ToggleButton}.active & {
      transform: translateY(9px) rotate(45deg);
    }
  }

  &:nth-child(2) {
    ${ToggleButton}.active & {
      opacity: 0;
    }
  }

  &:nth-child(3) {
    ${ToggleButton}.active & {
      transform: translateY(-9px) rotate(-45deg);
    }
  }
`;

const MobileNavDiv = styled.div`
  display: none;

  @media screen and (max-width: 1000px) {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    background-color: #0583f2;
    opacity: 0.9;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    height: ${({ isNavActive }) => (isNavActive ? "40vh" : "0")};
    transition: height 0.5s;
  }
`;

const MobileNavList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MobileNavLink = styled(Link)`
  position: relative;
  font-size: 40px;
  margin-top: 20px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  opacity: ${({ isNavActive }) => (isNavActive ? 1 : 0)};
  pointer-events: ${({ isNavActive }) => (isNavActive ? "auto" : "none")};
  transition: all 0.3s ease, opacity 0.3s;

  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 3px;
    background-color: white;
    bottom: -3px;
    left: 0;
    transition: width 0.3s ease;
  }

  &:hover:before {
    width: 100%;
  }
`;
