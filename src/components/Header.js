import React from "react";
import { Link } from "react-router-dom";
import { Container as MapDiv } from "react-naver-maps";
import Mappage from "../pages/Mappage";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { carpoolDataState, taxiDataState } from "../atoms";

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
    <header>
      <h1>Carpool Web</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">
            <button onClick={handleHomeClick}>Home</button> 
            </Link>
          </li>
          <li>
            <Link to="/Info">
              <button>Info</button>
            </Link>
          </li>
          <li>
            <Link to="/Login">
              <button>Login</button>
            </Link>
          </li>
          <li>
            <Link to="/SignUp">
              <button>SignUp</button>
            </Link>
          </li>
          <li>
            <Link to="/Carpool">
              <button onClick={handleCarpoolClick}>Carpool</button> 
            </Link>
          </li>
          <li>
            <Link to="/Taxi">
            <button onClick={handleTaxiClick}>Taxi</button>
            </Link>
          </li>
        </ul>
      </nav>
      <MapDiv style={{ width: "100%", height: "600px", position: "relative" }}>
        <MarkerDataContainer />
      </MapDiv>
    </header>
  );
};

export default Header;
