import React, { useState, useEffect } from "react";
import { NaverMap, Marker, useNavermaps, InfoWindow } from "react-naver-maps";
import styled from "styled-components";
import {
  isLoggedInState,
  showCarpoolState,
  showTaxiState,
  CarpoolWritingState,
  TaxiWritingState,
} from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { customAPI } from "../customAPI";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarMarker from "../assets/icon/CarMarker.png";
import TaxiMarker from "../assets/icon/TaxiMarker_ver2.png";
import UserMarker from "../assets/icon/UserMarker.png";

const MapComponent = () => {
  const navermaps = useNavermaps();
  const [map, setMap] = useState(null);
  const [infowindow, setInfoWindow] = useState(null);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [carpoolData, setCarpoolData] = useState([]);
  const [taxiData, setTaxiData] = useState([]);
  const [joinPartyData, setJoinPartyData] = useState([]);
  const [myPartyData, setMyPartyData] = useState([]);
  const isCarpoolshow = useRecoilValue(showCarpoolState);
  const isTaxishow = useRecoilValue(showTaxiState);

  function onSuccessGeolocation(position) {
    if (!map || !infowindow) return;

    const location = new navermaps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );

    map.setCenter(location);
    map.setZoom(14);
  }

  function onErrorGeolocation() {
    if (!map || !infowindow) return;

    const center = map.getCenter();
    infowindow.setContent(
      '<div style="padding:20px;">' +
        '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>' +
        "latitude: " +
        center.lat() +
        "<br />longitude: " +
        center.lng() +
        "</div>"
    );
    infowindow.open(map, center);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onSuccessGeolocation,
        onErrorGeolocation
      );
    } else {
      const center = map.getCenter();
      infowindow.setContent(
        '<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>'
      );
      infowindow.open(map, center);
    }
  }

  function handleMarkerClick(marker) {
    if (!map) return;

    const location = new navermaps.LatLng(marker.latitude, marker.longitude);

    map.setZoom(14);
    map.panTo(location); //화면 부드럽게 이동
  }

  const fetchCarpoolData = async () => {
    try {
      const response = await customAPI.get(`http://localhost:8080/parties`, {
        params: {
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
      console.log(carpoolData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchTaxiData = async () => {
    try {
      const response = await customAPI.get(`http://localhost:8080/parties`, {
        params: {
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
      console.log(taxiData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getMyParty = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await customAPI.get(`/members/participation-list/`, {});

      const myList = response.data;
      myList.map((item) => {
        setJoinPartyData((prev) => prev.concat(item));
      });
      console.log(joinPartyData);

      const response1 = await customAPI.get(`/members/notice-list/`, {});
      const data = response1.data;
      data.map((item) => {
        setMyPartyData((prev) => prev.concat(item));
      });

      console.log(myPartyData);
    } catch (err) {
      console.log("Faild to get Party Data", err);
    }
  };

  // const getRoutes = async () => {
  //   try {
  //     const response = await customAPI(
  //       `https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving?start=37.8688486697594,127.735245120657&goal=37.86369763697937,127.72376542374549`,
  //       {
  //         headers: {
  //           "X-NCP-APIGW-API-KEY-ID": process.env.REACT_APP_NAVER_CLIENT_ID,
  //           "X-NCP-APIGW-API-KEY": process.env.REACT_APP_NAVER_CLIENT_SECRET,
  //         },
  //       }
  //     );

  //     console.log(response);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    fetchCarpoolData();
    fetchTaxiData();
    if (isLoggedIn) getMyParty();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!map || !infowindow) {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onSuccessGeolocation,
        onErrorGeolocation
      );
    } else {
      var center = map.getCenter();
      infowindow.setContent(
        '<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>'
      );
      infowindow.open(map, center);
    }
  }, [map, infowindow]);

  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(36.7115, 128.0134)}
      defaultZoom={7}
      defaultMapTypeId={navermaps.MapTypeId.NORMAL}
      ref={setMap}
    >
      {/* <Marker
        position={{
          lat: parseFloat(item.startLat),
          lng: parseFloat(item.startLng),
        }}
      /> */}
      {!isTaxishow
        ? carpoolData.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              title={marker.name}
              icon={{
                url: CarMarker,
                size: new navermaps.Size(45, 45),
                scaledSize: new navermaps.Size(45, 45),
                origin: new navermaps.Point(0, 0),
                anchor: new navermaps.Point(20, 20),
              }}
              onClick={() => handleMarkerClick(marker)}
            />
          ))
        : null}
      {!isCarpoolshow
        ? taxiData.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              title={marker.name}
              icon={{
                url: TaxiMarker,
                size: new navermaps.Size(45, 45),
                scaledSize: new navermaps.Size(45, 45),
                origin: new navermaps.Point(0, 0),
                anchor: new navermaps.Point(20, 20),
              }}
              onClick={() => handleMarkerClick(marker)}
            />
          ))
        : null}

      <InfoWindow ref={setInfoWindow} />
    </NaverMap>
  );
};

export default MapComponent;
