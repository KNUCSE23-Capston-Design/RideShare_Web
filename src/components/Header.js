import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo/mainlogo.svg";
import styled from "styled-components";

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

const Header = () => {
    return (
        <StyledHeader>
            <Link to="/">
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
                        <NavLink to="/carpool">카풀</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/Taxi">택시</NavLink>
                    </NavItem>
                </NavLists>
            </StyledNav>
        </StyledHeader>
    );
};

export default Header;
