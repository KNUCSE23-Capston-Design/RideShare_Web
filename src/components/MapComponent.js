import { NaverMap, Marker, useNavermaps, InfoWindow } from "react-naver-maps";
import { useState, useEffect } from "react";

const MapComponent = ({ CarpoolMarkerData, TaxiMarkerData }) => {
    const navermaps = useNavermaps();
    // useRef 대신 useState를 통해 ref를 가져옵니다.
    const [map, setMap] = useState(null);
    const [infowindow, setInfoWindow] = useState(null);

    function onSuccessGeolocation(position) {
        if (!map || !infowindow) return;

        const location = new navermaps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(location);
        map.setZoom(10);
        infowindow.setContent('<div style="padding:20px;">' + "geolocation.getCurrentPosition() 위치" + "</div>");
        infowindow.open(map, location);
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
        <NaverMap defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)} defaultZoom={20} defaultMapTypeId={navermaps.MapTypeId.NORMAL} ref={setMap}>
            {CarpoolMarkerData.map((marker, index) => (
                <Marker
                    key={index}
                    position={{ lat: marker.latitude, lng: marker.longitude }}
                    title={marker.name}
                    //마커 이름 로그 찍기
                    onClick={() => {
                        console.log(`Clicked on marker: ${marker.name}`);
                    }}
                />
            ))}
            {TaxiMarkerData.map((marker, index) => (
                <Marker
                    key={index}
                    position={{ lat: marker.latitude, lng: marker.longitude }}
                    title={marker.name}
                    //Taxi마커는 빨간색 점으로 표현(일시적) 적당한 마커 아이콘 찾기 필요
                    icon={{
                        content: `<div style="width: 20px; height: 20px; background-color: red; border-radius: 50%;"></div>`,
                        size: new navermaps.Size(20, 20),
                        anchor: new navermaps.Point(15, 30),
                    }}
                    //마커 이름 로그 찍기
                    onClick={() => {
                        console.log(`Clicked on marker: ${marker.name}`);
                    }}
                />
            ))}
            <InfoWindow ref={setInfoWindow} />
        </NaverMap>
    );
};

export default MapComponent;
