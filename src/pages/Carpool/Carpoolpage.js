import { React, useEffect, useState, useRef, startTransition } from "react";
import { useNavigation } from "react-router-dom";
import { useRecoilState, useRecoilCallback, useRecoilValue } from "recoil";
import axios from "axios";
import { showCarpoolState, carpoolDataState, isMapLoadingState } from "../../atoms";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from "react-naver-maps";
import { NavermapsProvider } from "react-naver-maps";
import Mappage from "./Mappage";

const Carpool = () => {
    // const [location, setLocation] = useState({ lat: null, lng: null });
    return (
        <MapDiv style={{ width: "100%", height: "600px" }}>
            <Mappage />
        </MapDiv>
    );
};
export default Carpool;
