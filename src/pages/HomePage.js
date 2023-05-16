import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <header>
                <a>
                    <h1>Logo</h1>
                </a>
                <Link to="/carpool">carpoo</Link>
                <Link to="/Taxi">taxi</Link>
                <button>taxi</button>
                <button>login</button>
                <button>my info</button>
            </header>
            <h1>HomePage</h1>
        </div>
    );
};

export default Home;
