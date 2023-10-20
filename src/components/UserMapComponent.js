import React, { useState, useEffect } from "react";
import { NaverMap, Marker, useNavermaps, InfoWindow } from "react-naver-maps";
import styled from "styled-components";
import { isLoggedInState, showCarpoolState, showTaxiState } from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { customAPI } from "../customAPI";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarMarker from "../assets/icon/CarMarker.png";
import TaxiMarker from "../assets/icon/TaxiMarker_ver2.png";
import UserMarker from "../assets/icon/UserMarker.png";

const MapComponent = (props) => {
  const item = props.item;
  const navermaps = useNavermaps();
  const [map, setMap] = useState(null);
  const [infowindow, setInfoWindow] = useState(null);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [myPartyData, setMyPartyData] = useState([]);

  function onSuccessGeolocation(position) {
    if (!map || !infowindow) return;

    const location = new navermaps.LatLng(item.startLat, item.startLng);

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

  useEffect(() => {
    setMyPartyData(item);
  }, []);

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
      defaultCenter={new navermaps.LatLng(item.startLat, item.startlng)}
      defaultZoom={7}
      defaultMapTypeId={navermaps.MapTypeId.NORMAL}
      ref={setMap}
    >
      {myPartyData.type === "카풀" && (
        <Marker
          position={{
            lat: parseFloat(myPartyData.startLat),
            lng: parseFloat(myPartyData.startLng),
          }}
          icon={{
            url: CarMarker,
            size: new navermaps.Size(45, 45),
            scaledSize: new navermaps.Size(45, 45),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(20, 20),
          }}
          onClick={() => handleMarkerClick(myPartyData)}
        />
      )}
      {myPartyData.type === "택시" && (
        <Marker
          position={{
            lat: parseFloat(myPartyData.startLat),
            lng: parseFloat(myPartyData.startLng),
          }}
          icon={{
            url: TaxiMarker,
            size: new navermaps.Size(45, 45),
            scaledSize: new navermaps.Size(45, 45),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(20, 20),
          }}
          onClick={() => handleMarkerClick(myPartyData)}
        />
      )}

      <InfoWindow ref={setInfoWindow} />
    </NaverMap>
  );
};

export default MapComponent;
