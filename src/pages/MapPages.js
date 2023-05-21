import React from "react";
import MapComponent from "../components/MapComponent";
import { Container as MapDiv } from "react-naver-maps";
import { carpoolDataState, taxiDataState } from "../atoms";
import { useRecoilValue } from "recoil";

const MarkerDataContainer = () => {
    const carpoolMarkerData = useRecoilValue(carpoolDataState);
    const taxiMarkerData = useRecoilValue(taxiDataState);
  
    return (
      <MapComponent CarpoolMarkerData={carpoolMarkerData} TaxiMarkerData={taxiMarkerData} />
    );
  };

const MapPage = () => {
  return (
    <MapDiv style={{ width: "100%", height: "600px", position: "relative" }}>
        <MarkerDataContainer />
      </MapDiv>
  );
}

export default MapPage;