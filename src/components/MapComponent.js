import React, { useState, useEffect } from "react";
import { NaverMap, Marker, useNavermaps, InfoWindow } from "react-naver-maps";
import {
  isLoggedInState,
  showCarpoolState,
  showTaxiState,
  listItemInfo,
} from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { customAPI } from "../customAPI";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarMarker from "../assets/icon/CarMarker.png";
import TaxiMarker from "../assets/icon/TaxiMarker_ver2.png";

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
  const [itemInfo, setItemInfo] = useRecoilState(listItemInfo);

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
    map.panTo(location);
  }

  const handleMovingCenter = (item) => {
    if (!map || !item) return;

    const location = new navermaps.LatLng(item.startLat, item.startLng);

    map.setZoom(14);
    map.panTo(location);
    setItemInfo(null);
  };

  const fetchCarpoolData = async () => {
    try {
      const response = await customAPI.get(`/parties`, {
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchTaxiData = async () => {
    try {
      const response = await customAPI.get(`/parties`, {
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getMyParty = async () => {
    try {
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

  useEffect(() => {
    fetchCarpoolData();
    fetchTaxiData();
    if (isLoggedIn) getMyParty();
  }, [isLoggedIn]);

  useEffect(() => {
    if (itemInfo) handleMovingCenter(itemInfo);
  }, [itemInfo]);

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
