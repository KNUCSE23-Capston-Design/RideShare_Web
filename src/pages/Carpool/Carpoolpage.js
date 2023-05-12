import { React, useEffect } from "react";
import { useNavigation } from "react-router-dom";
import { useRecoilState, useRecoilCallback, useRecoilValue } from "recoil";
import axios from "axios";
import { showCarpoolState, carpoolDataState, isMapLoadingState } from "../../atoms";

const Carpool = () => {
    const navigation = useNavigation();
    const [showCarpool, setShowCarpool] = useRecoilState(showCarpoolState);
    const [carpoolData, setCarpoolData] = useRecoilState(carpoolDataState);
    const screenType = "carpools";
    const isMapLoading = useRecoilValue(isMapLoadingState);

    const getData = async (screen) => {
        try {
            const jsonData = await axios.get(`http://localhost:8080/parties/${screen}`);

            const dataArray = jsonData.data;
            const listData = dataArray.map((item) => ({
                carNumber: item.carNumber,
                confirm: item.confirm,
                content: item.content,
                currentHeadcnt: item.currentHeadcnt,
                endPoint: item.endPoint,
                p_id: item.p_id,
                p_type: item.p_type,
                startDateStr: item.startDateStr,
                startPoint: item.startPoint,
                startTime: item.startTime,
                startTimeStr: item.startTimeStr,
                totalHeadcnt: item.total,
                startLat: item.startLat,
                startLng: item.startLng,
            }));

            setCarpoolData(listData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getData(screenType);
    }, []);

    return <></>;
};
export default Carpool;
