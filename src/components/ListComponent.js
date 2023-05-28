import { useState, useEffect } from "react";
import styled from "styled-components";
import { showCarpoolState, showTaxiState } from "../atoms";
import { useRecoilValue } from "recoil";
import "intersection-observer";
import axios from "axios";

// problem : 스크롤 바를 체크하는 target1, target이 서로 연동됨
const ListComponent = () => {
    const [carpoolItems, setCarpoolItems] = useState([]);
    const [taxiItems, setTaxiItems] = useState([]);
    const [target, setTarget] = useState(null);
    const [target1, setTarget1] = useState(null);
    const isCarpoolshow = useRecoilValue(showCarpoolState);
    const [tempId, setTempId] = useState(0);
    const [tempId1, setTempId1] = useState(0);

    let carpoolId = 41;
    if (tempId !== 0) carpoolId = tempId;
    let taxiId = 21;
    if (tempId1 !== 0) taxiId = tempId1;

    const carpoolFetchData = async () => {
        const response = await axios.get(`http://192.168.0.107:8080/parties`, {
            params: {
                lastId: carpoolId,
                amount: 2,
                type: "카풀",
                keyword: "",
            },
        });

        const data = await response.data;
        console.log(carpoolItems[0]);

        setCarpoolItems((prev) => prev.concat(data));
        carpoolId -= 2;
        // setItems((prev) => prev.concat(data));
        console.log(carpoolId, "카풀");
    };

    const taxiFetchData = async () => {
        const response = await axios.get(`http://192.168.0.107:8080/parties`, {
            params: {
                lastId: taxiId,
                amount: 2,
                type: "택시",
                keyword: "",
            },
        });

        const data = await response.data;

        setTaxiItems((prev) => prev.concat(data));
        taxiId -= 2;
        // setItems((prev) => prev.concat(data));
        console.log(taxiId, "택시");
    };

    useEffect(() => {
        isCarpoolshow ? carpoolFetchData() : taxiFetchData();
    }, []);

    // 새로고침 시 state 초기화
    // useEffect(() => {
    //     if (window.location.reload) {
    //         setCarpoolItems([]);
    //         setTexiItems([]);
    //         carpoolCurrentId = 41;
    //         taxiCurrentId = 21;
    //     }
    // }, [window.location.reload]);

    useEffect(() => {
        let observer;
        if (target && isCarpoolshow) {
            const onIntersect = async ([entry], observer) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    // carpoolId < 23
                    if (carpoolId < 23) {
                        return () => observer && observer.disconnect();
                    }
                    await (isCarpoolshow ? carpoolFetchData() : taxiFetchData());
                    observer.observe(entry.target);
                    setTempId(carpoolId);
                }
            };
            observer = new IntersectionObserver(onIntersect, { threshold: 0.7 });
            observer.observe(target);
        }
        return () => observer && observer.disconnect();
    }, [target, isCarpoolshow]);

    useEffect(() => {
        let observer1;
        if (target1 && !isCarpoolshow) {
            const onIntersect = async ([entry], observer) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    if (taxiId < 2) {
                        // setTempId1(taxiId);
                        return () => observer && observer.disconnect();
                    }
                    await (isCarpoolshow ? carpoolFetchData() : taxiFetchData());
                    observer.observe(entry.target);
                    setTempId1(taxiId);
                }
            };
            observer1 = new IntersectionObserver(onIntersect, { threshold: 0.7 });
            observer1.observe(target1);
        }
        return () => observer1 && observer1.disconnect();
    }, [target1, isCarpoolshow]);

    return (
        <Main>
            {isCarpoolshow ? (
                <div>
                    {carpoolItems.map((item, id) => {
                        return (
                            <div key={id}>
                                <div>{item.pid}</div>
                                <div>{item.startPoint}</div>
                            </div>
                        );
                    })}
                    <div ref={setTarget}>this is the target</div>
                </div>
            ) : (
                <div>
                    {taxiItems.map((item, id) => {
                        return (
                            <div key={id}>
                                <div>{item.pid}</div>
                                <div>{item.startPoint}</div>
                            </div>
                        );
                    })}
                    <div ref={setTarget1}>this is the target</div>
                </div>
            )}

            {/* <div ref={setTarget}>this is the target</div> */}
        </Main>
    );
};

export default ListComponent;

// observer가 인식하는 뷰포트의 최대 크기는 100vh이다 그러나 화면에 맞추기 위해서는 threshold 값을 조정해야 한다.
const Main = styled.div`
    width: 30%;
    height: calc(100vh - 87.6px);
    overflow-y: scroll;
`;
