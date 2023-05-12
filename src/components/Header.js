import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Carpool Web</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <button>Home</button>
            </Link>
          </li>
          <li>
            <Link to="/Info">
              <button>Info</button>
            </Link>
          </li>
          <li>
            <button>Login</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
