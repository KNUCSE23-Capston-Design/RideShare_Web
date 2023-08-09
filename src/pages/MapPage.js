import React, { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { Container as MapDiv } from "react-naver-maps";
import {
  carpoolDataState,
  taxiDataState,
  showCarpoolState,
  showTaxiState,
} from "../atoms";
import { useRecoilValue } from "recoil";
import ListComponent from "../components/ListComponent";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const carpoolMarkerData = useRecoilValue(carpoolDataState);
  const taxiMarkerData = useRecoilValue(taxiDataState);
  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, []);

  if (!accessToken) {
    return null;
  }

  return (
    <MainDiv>
      <MapBox>
        <MapComponent
          CarpoolMarkerData={carpoolMarkerData}
          TaxiMarkerData={taxiMarkerData}
        />
        ;
      </MapBox>
      <ListComponent />
    </MainDiv>
  );
};

const MainDiv = styled.div`
  display: flex;
  align-items: center;
  background-color: #f4f8fe;
`;

const MapBox = styled(MapDiv)`
  width: 67%;
  height: calc(100vh - 87.6px);
  position: relative;
`;

export default MapPage;
