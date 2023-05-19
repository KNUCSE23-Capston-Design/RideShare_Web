import { React, useEffect } from "react";
import { useRecoilState } from "recoil";
import { taxiDataState } from "../../atoms";

const Taxi = () => {
    const [taxiData, setTaxiData] = useRecoilState(taxiDataState);

    const markerData = [
      { name: "TaxiLocation 1", latitude: 37.8751, longitude: 127.7464 },
      { name: "TaxiLocation 2", latitude: 37.8635, longitude: 127.7316 },
      { name: "TaxiLocation 3", latitude: 37.8649, longitude: 127.7411 },
  ];

    useEffect(() => {
      setTaxiData(markerData);
    }, [setTaxiData]);

    return (
        <></>
    );
};
export default Taxi;