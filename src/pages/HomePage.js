import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    const [searchText, setSearchText] = useState("");

    return (
        <div>
            <h1>Home</h1>
            <input type="text" placeholder="목적지를 입력해주세요" value={searchText} />
            <li>
            <Link to="/Carpool">carpool</Link>
            </li>
            <li>
            <Link to="/Taxi">taxi</Link>
            </li>
        </div>
    );
};

export default Home;
