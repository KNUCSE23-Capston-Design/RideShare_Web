import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container as MapDiv } from "react-naver-maps";
import { useRecoilState, useResetRecoilState, useRecoilValue } from "recoil";
import {
  showCarpoolState,
  showTaxiState,
  carpoolDataState,
  taxiDataState,
  isLoggedInState,
} from "../atoms";
import { ReactComponent as Logo } from "../assets/logo/mainlogo.svg";
import { removeCookieToken, getCookieToken } from "../Cookies";
import { accessTokenState } from "../atoms";
import styled from "styled-components";
import axios from "axios";
import { setRefreshToken } from "../Cookies";

const Header = () => {
  const resetTaxiMarkerData = useResetRecoilState(taxiDataState);
  const resetCarpoolMarkerData = useResetRecoilState(carpoolDataState);
  const resetshowCarpool = useResetRecoilState(showCarpoolState);
  const resetshowTaxi = useResetRecoilState(showTaxiState);
  const [showCarpool, setshowCarpool] = useRecoilState(showCarpoolState);
  const [showTaxi, setshowTaxi] = useRecoilState(showTaxiState);
  const [carpoolData, setCarpoolData] = useRecoilState(carpoolDataState);
  const [taxiData, setTaxiData] = useRecoilState(taxiDataState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [logoMargin, setLogoMargin] = useState("270px");
  const [loginMargin, setLoginMargin] = useState("270px");

  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const token = getCookieToken();

  const grantAccessToken = async () => {
    console.log(token);
    try {
      const response = await axios.post(
        `http://localhost:8080/members/reissue`,
        {
          accessToken: accessToken,
          refreshToken: token,
        }
      );
      const data = response.data;
      const { accessToken: newAccessToken, refreshToken } = data;

      setAccessToken(newAccessToken);
      console.log("재발급" + accessToken);
      setRefreshToken(refreshToken);
      console.log("재발급" + refreshToken);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCarpoolData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/parties`, {
        params: {
          amount: 15,
          type: "카풀",
          keyword: "",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      const markerData = data.map((item) => ({
        name: item.pid,
        latitude: parseFloat(item.startLat),
        longitude: parseFloat(item.startLng),
      }));
      setCarpoolData(markerData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTaxiData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/parties`, {
        params: {
          amount: 20,
          type: "택시",
          keyword: "",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      const markerData = data.map((item) => ({
        name: item.pid,
        latitude: parseFloat(item.startLat),
        longitude: parseFloat(item.startLng),
      }));
      setTaxiData(markerData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // f5을 실행시키게 되면 store 자체가 초기화가 되기 때문에 쿠키의 존재유무를 통해 로그인 상태를 유지한다.
  const checkLogin = () => {
    if (token) {
      setIsLoggedIn(true);
      if (!accessToken) {
        grantAccessToken();
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  //브라우저의 크기 변화시 로고와 로그인 자연스럽게 변화
  useEffect(() => {
    checkLogin();
    fetchCarpoolData();
    fetchTaxiData();
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 1500) {
        setLogoMargin("30px");
        setLoginMargin("30px");
      } else {
        setLogoMargin("270px");
        setLoginMargin("270px");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCarpoolData, setTaxiData]);

  const handleHomeClick = () => {
    resetCarpoolMarkerData();
    resetTaxiMarkerData();
  };

  const handleCarpoolClick = () => {
    resetTaxiMarkerData();
    resetshowTaxi();
    fetchCarpoolData();
    setshowCarpool(true);
  };

  const handleTaxiClick = () => {
    resetCarpoolMarkerData();
    resetshowCarpool();
    fetchTaxiData();
    setshowTaxi(true);
  };

  const handleLogoutClick = () => {
    removeCookieToken();
    setIsLoggedIn(false);
  };

  return (
    <StyledHeader>
      <Link to="/" onClick={handleHomeClick}>
        <MainLogo margin={logoMargin} />
      </Link>
      <StyledNav>
        <NavLists>
          <NavGroup>
            <NavItem>
              <NavLink to="/MapPage" onClick={handleCarpoolClick}>
                카풀
              </NavLink>
            </NavItem>
            <Divider />
            <NavItem>
              <NavLink to="/MapPage" onClick={handleTaxiClick}>
                택시
              </NavLink>
            </NavItem>
          </NavGroup>
        </NavLists>
      </StyledNav>
      <NavLists>
        <NavItem>
          <NavLink to="/Info">내 정보</NavLink>
        </NavItem>
        {isLoggedIn ? (
          <CustomNavItem>
            <CustomNavLink
              to="/"
              onClick={handleLogoutClick}
              margin={loginMargin}
            >
              로그아웃
            </CustomNavLink>
          </CustomNavItem>
        ) : (
          <CustomNavItem>
            <CustomNavLink to="/Login" margin={loginMargin}>
              로그인
            </CustomNavLink>
          </CustomNavItem>
        )}
      </NavLists>
    </StyledHeader>
  );
};

export default Header;

const MainLogo = styled(Logo)`
  width: 140px;
  height: 50px;
  margin-top: 14px;
  margin-left: ${(props) => props.margin};
  transition: all 0.5s ease;
`;

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-family: "Noto Sans KR", sans-serif;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: auto;
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
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: bold;
  transition: all 0.5s ease;
  :hover {
    color: #0583f2;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #ccc;
  margin: 0 10px;
`;

const CustomNavItem = styled.li`
  margin-left: 30px;
`;

const CustomNavLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: bold;
  transition: all 0.5s ease;
  margin-right: ${(props) => props.margin};
  :hover {
    color: #0583f2;
  }
`;
