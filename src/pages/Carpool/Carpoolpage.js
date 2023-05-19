import { React, useEffect, useState, useRef, startTransition } from "react";
import { useNavigation } from "react-router-dom";
import { useRecoilState, useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { showCarpoolState, carpoolDataState, isMapLoadingState } from "../../atoms";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from "react-naver-maps";
import { NavermapsProvider } from "react-naver-maps";

const Carpool = () => {
    // const navigation = useNavigation();
    const [showCarpool, setShowCarpool] = useRecoilState(showCarpoolState);
    const [carpoolData, setCarpoolData] = useRecoilState(carpoolDataState);
    const screenType = "carpools";
    const isMapLoading = useRecoilValue(isMapLoadingState);

    const markerData = [
        { name: "CarpoolLocation 1", latitude: 37.8851, longitude: 127.7364 },
        { name: "CarpoolLocation 2", latitude: 37.8735, longitude: 127.7416 },
        { name: "CarpoolLocation 3", latitude: 37.8749, longitude: 127.7311 },
    ];

    useEffect(() => {
        setCarpoolData(markerData);
    }, [setCarpoolData]);

    return (
        <></>
    );
};
export default Carpool;
