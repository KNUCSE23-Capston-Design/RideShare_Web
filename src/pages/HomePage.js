import React, { useState, useEffect } from "react";
import { NaverMap, Marker, useNavermaps, InfoWindow } from "react-naver-maps";
import { Container as MapDiv, Polyline } from "react-naver-maps";
import styled from "styled-components";
import Slider from "react-slick";
import { isLoggedInState } from "../atoms";
import { useRecoilValue } from "recoil";
import { ReactComponent as ArrowForward } from "../assets/icon/arrow_forward.svg";
import { ReactComponent as ArrowBack } from "../assets/icon/arrow_back.svg";
import { customAPI } from "../customAPI";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const navermaps = useNavermaps();
  const [map, setMap] = useState(null);
  const [infowindow, setInfoWindow] = useState(null);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [joinPartyData, setJoinPartyData] = useState([]);
  const [myPartyData, setMyPartyData] = useState([]);

  const CustomPrevArrow = (props) => (
    <div
      onClick={props.onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ArrowForward />
    </div>
  );

  // 다음 화살표 컴포넌트
  const CustomNextArrow = (props) => (
    <div
      onClick={props.onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ArrowBack />
    </div>
  );
  const sliderSettings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomNextArrow />, // 이전 화살표 컴포넌트 사용
    nextArrow: <CustomPrevArrow />, // 다음 화살표 컴포넌트 사용
    swipe: false,
  };

  function onSuccessGeolocation(position) {
    if (!map || !infowindow) return;

    const location = new navermaps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );

    map.setCenter(location);
    map.setZoom(15);

    // const userMarker = new navermaps.Marker({
    //   position: location,
    //   map: map,
    //   icon: {
    //     url: UserMarker,
    //     size: new navermaps.Size(15, 15),
    //     scaledSize: new navermaps.Size(15, 15),
    //     origin: new navermaps.Point(0, 0),
    //     anchor: new navermaps.Point(20, 20),
    //   },
    // });

    infowindow.close();
    // console.log("Coordinates: " + location.toString());
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

  const getMyParty = async () => {
    console.log("get my party");
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
    } catch (err) {
      console.log("Faild to get Party Data", err);
    }
  };

  const getRoutes = async () => {
    try {
      const response = await customAPI(
        `https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving?start=37.8688486697594,127.735245120657&goal=37.86369763697937,127.72376542374549`,
        {
          headers: {
            "X-NCP-APIGW-API-KEY-ID": process.env.REACT_APP_NAVER_CLIENT_ID,
            "X-NCP-APIGW-API-KEY": process.env.REACT_APP_NAVER_CLIENT_SECRET,
          },
        }
      );

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setJoinPartyData([]);
    getMyParty();
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

    console.log(joinPartyData);
  }, [map, infowindow]);

  return (
    <MainDiv>
      <MainContentGroup>
        <DestinationInput
          type="text"
          name="inputName"
          placeholder="   목적지를 입력하시오"
        />
        {isLoggedIn ? (
          <CustomSlider {...sliderSettings}>
            {joinPartyData.length !== 0 ? (
              joinPartyData.map((item, id) => {
                return (
                  <div key={id}>
                    <MainContentBox>
                      <MapBox>
                        <NaverMap
                          defaultCenter={
                            new navermaps.LatLng(36.7115, 128.0134)
                          }
                          defaultZoom={10}
                          defaultMapTypeId={navermaps.MapTypeId.NORMAL}
                          ref={setMap}
                        >
                          <InfoWindow ref={setInfoWindow} />

                          {/* <Polyline
                            path={[
                              new navermaps.maps.LatLng(
                                37.37544345085402,
                                127.11224555969238
                              ),
                              new navermaps.maps.LatLng(
                                37.37230584065902,
                                127.10791110992432
                              ),
                              new navermaps.maps.LatLng(
                                37.35975408751081,
                                127.10795402526855
                              ),
                            ]}
                            // clickable // 사용자 인터랙션을 받기 위해 clickable을 true로 설정합니다.
                            strokeColor={"#ff3344"}
                            strokeStyle={"solid"}
                            strokeOpacity={0.8}
                            strokeWeight={4}
                          /> */}

                          <Marker
                            position={{
                              lat: parseFloat(item.startLat),
                              lng: parseFloat(item.startLng),
                            }}
                          />

                          <Marker
                            position={{
                              lat: parseFloat("37.8688486697594"),
                              lng: parseFloat("127.735245120657"),
                            }}
                          />
                        </NaverMap>
                      </MapBox>
                      <ContentBox>
                        <h3>참가중인 파티</h3>
                        <h3>{item.type}</h3>
                        <h3>{item.startPoint}</h3>
                        <h3>{item.endPoint}</h3>
                      </ContentBox>
                    </MainContentBox>
                  </div>
                );
              })
            ) : (
              <MainContentBox>
                <LogoutContentBox>
                  현재 참가중인 파티가 없습니다.
                </LogoutContentBox>
              </MainContentBox>
            )}

            {myPartyData.length !== 0 ? (
              myPartyData.map((item, id) => {
                return (
                  <div key={id}>
                    <MainContentBox>
                      <MapBox>
                        <NaverMap
                          defaultCenter={
                            new navermaps.LatLng(36.7115, 128.0134)
                          }
                          defaultZoom={10}
                          defaultMapTypeId={navermaps.MapTypeId.NORMAL}
                          ref={setMap}
                        >
                          <InfoWindow ref={setInfoWindow} />
                        </NaverMap>
                      </MapBox>
                      <ContentBox>
                        <h3>나의 파티</h3>
                        <h3>{item.type}</h3>
                        <h3>{item.startPoint}</h3>
                        <h3>{item.endPoint}</h3>
                      </ContentBox>
                    </MainContentBox>
                  </div>
                );
              })
            ) : (
              <MainContentBox>
                <LogoutContentBox>
                  현재 생성한 파티가 없습니다.
                </LogoutContentBox>
              </MainContentBox>
            )}
          </CustomSlider>
        ) : (
          <MainContentBox>
            <LogoutContentBox>로그인이 필요합니다.</LogoutContentBox>
          </MainContentBox>
        )}
      </MainContentGroup>
    </MainDiv>
  );
};

export default Home;

const MainDiv = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;

  @media screen and (max-width: 480px) {
    margin-top: 20px;
  }
`;

const DestinationInput = styled.input`
  width: 40vw;
  height: 50px;
  margin-bottom: 20px;

  border-radius: 15px;
  border: 2px solid #0583f2;
  z-index: 1;

  @media screen and (max-width: 1280px) {
    width: 50vw;
  }

  @media screen and (max-width: 480px) {
    width: 300px;
  }
`;

const MainContentGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const MainContentBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 1280px) {
    width: 60vw;
    flex-direction: column;
  }

  @media screen and (max-width: 480px) {
    width: 360px;
    flex-direction: column;
  }
`;

const MapBox = styled(MapDiv)`
  border-radius: 15px;
  width: 35vw;
  height: 35vw;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 1280px) {
    width: 58vw;
    height: 38vw;
  }

  @media screen and (max-width: 480px) {
    width: 95%;
    height: 300px;
  }
`;

const ContentBox = styled.div`
  border-radius: 15px;
  width: 25vw;
  height: 35vw;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media screen and (max-width: 1280px) {
    width: 58vw;
    height: 11vw;
  }

  @media screen and (max-width: 480px) {
    width: 95%;
    height: 200px;
  }
`;

const CustomSlider = styled(Slider)`
  .slick-prev,
  .slick-next {
    background-color: transparent;
    z-index: 1; /* 화살표가 다른 요소 위에 표시되도록 설정 */
  }

  /* 다른 슬라이더 스타일 설정 */
  width: 60vw;
  height: 35vw;
  display: flex;

  @media screen and (max-width: 1280px) {
    width: 60vw;
    height: 50vw;
    // flex-direction: column;
  }

  @media screen and (max-width: 480px) {
    width: 360px;
    height: 506px;
    // flex-direction: column;
  }
`;

const LogoutContentBox = styled.div`
  border-radius: 30px;
  width: 55vw;
  height: 35vw;
  background-color: grey;
  opacity: 0.2;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 2em;
  font-weight: bold;
  color: black;

  @media screen and (max-width: 1280px) {
    width: 60vw;
    height: 50vw;
    // flex-direction: column;
  }

  @media screen and (max-width: 480px) {
    width: 360px;
    height: 506px;
    // flex-direction: column;
  }
`;
