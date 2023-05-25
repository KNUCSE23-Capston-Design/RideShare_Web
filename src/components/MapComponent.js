import { NaverMap, Marker, useNavermaps, InfoWindow } from "react-naver-maps";
import { useState, useEffect } from "react";
import CarMarker from "../assets/icon/CarMarker.png";
import TaxiMarker from "../assets/icon/TaxiMarker_ver2.png";
import UserMarker from "../assets/icon/UserMarker.png"

const MapComponent = ({ CarpoolMarkerData, TaxiMarkerData }) => {
    const navermaps = useNavermaps();
    // useRef 대신 useState를 통해 ref를 가져옵니다.
    const [map, setMap] = useState(null);
    const [infowindow, setInfoWindow] = useState(null);

    function onSuccessGeolocation(position) {
        if (!map || !infowindow) return;

        const location = new navermaps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(location);
        map.setZoom(16);

        const userMarker = new navermaps.Marker({
          position: location,
          map: map,
          icon: {
            url: UserMarker,
            size: new navermaps.Size(15, 15),
            scaledSize: new navermaps.Size(15, 15),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(20, 20),
          },
        });

        infowindow.close(); 
        console.log("Coordinates: " + location.toString());
    }

    function onErrorGeolocation() {
        if (!map || !infowindow) return;

        const center = map.getCenter();
        infowindow.setContent(
            '<div style="padding:20px;">' + '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>' + "latitude: " + center.lat() + "<br />longitude: " + center.lng() + "</div>"
        );
        infowindow.open(map, center);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
        } else {
            const center = map.getCenter();
            infowindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>');
            infowindow.open(map, center);
        }
    }

    function handleMarkerClick(marker) {
      if (!map) return;
  
      const location = new navermaps.LatLng(marker.latitude, marker.longitude);
      
      map.setZoom(16);
      map.panTo(location); //화면 부드럽게 이동
    }

    useEffect(() => {
        if (!map || !infowindow) {
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
        } else {
            var center = map.getCenter();
            infowindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>');
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
        {CarpoolMarkerData.map((marker, index) => (
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
        ))}
        {TaxiMarkerData.map((marker, index) => (
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
        ))}
        <InfoWindow ref={setInfoWindow} />
      </NaverMap>
    );
};

export default MapComponent;
