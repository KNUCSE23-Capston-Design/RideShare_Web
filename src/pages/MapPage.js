import React, { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { Container as MapDiv } from "react-naver-maps";
import {
  carpoolDataState,
  taxiDataState,
  showCarpoolState,
  showTaxiState,
} from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import ListComponent from "../components/ListComponent";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { customAPI } from "../customAPI";

const MapPage = () => {
  const [carpoolData, setCarpoolData] = useRecoilState(carpoolDataState);
  const [taxiData, setTaxiData] = useRecoilState(taxiDataState);

  const accessToken = sessionStorage.getItem("accessToken");

  const showCarpool = useRecoilValue(showCarpoolState);
  const showTaxi = useRecoilValue(showTaxiState);
  const navigate = useNavigate();

  const fetchCarpoolData = async () => {
    try {
      const response = await customAPI.get(`http://localhost:8080/parties`, {
        params: {
          amount: 15,
          type: "카풀",
          keyword: "",
        },
      });
      const data = response.data;
      const markerData = data.map((item) => ({
        name: item.pid,
        latitude: parseFloat(item.startLat),
        longitude: parseFloat(item.startLng),
      }));
      setCarpoolData(markerData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchTaxiData = async () => {
    try {
      const response = await customAPI.get(`http://localhost:8080/parties`, {
        params: {
          amount: 20,
          type: "택시",
          keyword: "",
        },
      });
      const data = response.data;
      const markerData = data.map((item) => ({
        name: item.pid,
        latitude: parseFloat(item.startLat),
        longitude: parseFloat(item.startLng),
      }));
      setTaxiData(markerData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Header의 호출에 따라 MapComponent에 전달될 데이터를 선택한다.
  const checkRequestType = () => {
    if (showCarpool && !showTaxi) {
      fetchCarpoolData();
    } else if (showTaxi && !showCarpool) {
      fetchTaxiData();
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    checkRequestType();
  }, [showCarpool, showTaxi]);

  if (!accessToken) {
    return null;
  }

  return (
    <MainDiv>
      <MapBox>
        <MapComponent
          CarpoolMarkerData={carpoolData}
          TaxiMarkerData={taxiData}
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
