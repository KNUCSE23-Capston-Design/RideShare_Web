import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const MainDiv = styled.div`
    background-image: linear-gradient(to bottom, white, #f4f9ff);
    width: 100%;
    height: 100%;
`;
const Home = () => {
    return (
        <MainDiv>
            <div style={{ height: "90.4vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <h1>RideShare Homepage</h1>
            </div>
            <footer>hello</footer>
        </MainDiv>
    );
};

export default Home;
