import React, { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { Container as MapDiv } from "react-naver-maps";
import { carpoolDataState, taxiDataState } from "../atoms";
import { useRecoilValue } from "recoil";
import ListComponent from "../components/ListComponent";
import styled from "styled-components";
import axios from "axios";

const MarkerDataContainer = () => {
    const carpoolMarkerData = useRecoilValue(carpoolDataState);
    const taxiMarkerData = useRecoilValue(taxiDataState);

    return <MapComponent CarpoolMarkerData={carpoolMarkerData} TaxiMarkerData={taxiMarkerData} />;
};

const MapPage = () => {
    const client = axios.create({
        withCredentials: true,
    });

    const [items, setItems] = useState([]);
    const LastId = 35;
    const Amount = 10;
    const currentType = "카풀";

    async function getData(type) {
        try {
            const response = await client.get(`http://192.168.0.107:8080/parties`, {
                params: {
                    lastId: 35,
                    amount: 3,
                    type: "카풀",
                    keyword: "",
                },
            });
            setItems(response.data);
            console.log(items);
        } catch (error) {
            console.log(error);
        }
    }

    const getData2 = async (type) => {
        try {
            const response = await client.get(`http://192.168.0.107:8080/parties/40`);
            setItems(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // getData2(currentType);
        getData(currentType);
    }, [currentType]);

    return (
        <MainDiv>
            <MapDiv style={{ width: "70%", height: "600px", position: "relative" }}>
                <MarkerDataContainer />
            </MapDiv>
            <ListComponent />
        </MainDiv>
    );
};

const MainDiv = styled.div`
    display: flex;
    align-items: center;
`;

export default MapPage;
