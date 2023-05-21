import { React, useEffect, useState, useRef, startTransition } from "react";
import { useNavigation } from "react-router-dom";
import { useRecoilState, useRecoilCallback, useRecoilValue } from "recoil";
import axios from "axios";
import { showCarpoolState, carpoolDataState, isMapLoadingState } from "../../atoms";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from "react-naver-maps";
import { NavermapsProvider } from "react-naver-maps";
import Mappage from "./Mappage";

const Carpool = () => {
    // const navigation = useNavigation();
    const [showCarpool, setShowCarpool] = useRecoilState(showCarpoolState);
    const [carpoolData, setCarpoolData] = useRecoilState(carpoolDataState);
    const screenType = "carpools";
    const isMapLoading = useRecoilValue(isMapLoadingState);

    return (
        <MapDiv style={{ width: "70%", height: "92.4vh", position: "relative" }}>
            <Mappage />
        </MapDiv>
    );
};
export default Carpool;
