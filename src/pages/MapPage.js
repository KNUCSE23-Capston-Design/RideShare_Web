import React, { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { Container as MapDiv } from "react-naver-maps";
import { carpoolDataState, taxiDataState, showCarpoolState, showTaxiState } from "../atoms";
import { useRecoilValue } from "recoil";
import ListComponent from "../components/ListComponent";
import styled from "styled-components";
import axios from "axios";

const MapPage = () => {
    const carpoolMarkerData = useRecoilValue(carpoolDataState);
    const taxiMarkerData = useRecoilValue(taxiDataState);
    const isCarpoolshow = useRecoilValue(showCarpoolState);

    return (
        <MainDiv>
            <MapBox>
                <MapComponent CarpoolMarkerData={carpoolMarkerData} TaxiMarkerData={taxiMarkerData} />;
            </MapBox>
            <ListComponent />
        </MainDiv>
    );
};

const MainDiv = styled.div`
    display: flex;
    align-items: center;
`;

const MapBox = styled(MapDiv)`
    width: 70%;
    height: calc(100vh - 87.6px);
    position: relative;
`;

export default MapPage;
