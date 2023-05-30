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

    let carpoolId = -1;
    if (tempId !== 0) carpoolId = tempId;
    let taxiId = -1;
    if (tempId1 !== 0) taxiId = tempId1;

    //useEffect에 의해 observer와 묶여서 매번 호출되는 문제 개선 필요
    const getInitialData = async () => {
        const responseC = await axios.get(`http://localhost:8080/parties`, {
            params: {
                amount: 1,
                type: "카풀",
            },
        });

        const responseT = await axios.get(`http://localhost:8080/parties`, {
            params: {
                amount: 1,
                type: "택시",
            },
        });

        console.log(responseC);

        if (carpoolId === -1) carpoolId = responseC.data[0].pid + 1;
        // carpoolId = responseC.data[0].pid;
        // taxiId = responseT.data[0].pid;
        if (taxiId === -1) taxiId = responseT.data[0].pid + 1;
    };

    const carpoolFetchData = async () => {
        const response = await axios.get(`http://localhost:8080/parties`, {
            params: {
                lastId: carpoolId,
                amount: 2,
                type: "카풀",
                keyword: "",
            },
        });

        const data = await response.data;
        console.log(data);

        setCarpoolItems((prev) => prev.concat(data));
        carpoolId = data[data.length - 1].pid;
        // console.log(carpoolId, "카풀");
    };

    const taxiFetchData = async () => {
        const response = await axios.get(`http://localhost:8080/parties`, {
            params: {
                lastId: taxiId,
                amount: 2,
                type: "택시",
                keyword: "",
            },
        });

        const data = await response.data;
        console.log(data[data.length - 1]);

        setTaxiItems((prev) => prev.concat(data));
        taxiId = data[data.length - 1].pid;
        console.log(taxiId, "택시");
    };

    useEffect(() => {
        let observer;

        // if (tempId === 0) {
        //     carpoolId = getInitialData();
        // }

        if (target && isCarpoolshow) {
            const onIntersect = async ([entry], observer) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    // carpoolId < 23
                    if (carpoolId < 22 && carpoolId !== -1) {
                        return () => observer && observer.disconnect();
                    }
                    await getInitialData();
                    await carpoolFetchData();
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

        // if (tempId1 === 0) {
        //     getInitialData();
        // }

        if (target1 && !isCarpoolshow) {
            const onIntersect = async ([entry], observer) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    if (taxiId < 2 && taxiId !== -1) {
                        // setTempId1(taxiId);
                        return () => observer && observer.disconnect();
                    }

                    await getInitialData();
                    await taxiFetchData();
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
                            <ListItem key={id}>
                                <div>{item.pid}</div>
                                <ItemInfo>
                                    <div>출발지 : {item.startPoint}</div>
                                    <div>목적지 : {item.endPoint}</div>
                                    <div>
                                        출발 시간 : {item.startDate} {item.startTime}
                                    </div>
                                </ItemInfo>
                                <CurrentMember>{item.currentHeadcnt}명</CurrentMember>
                                <JoinButton>Join</JoinButton>
                            </ListItem>
                        );
                    })}
                    <div ref={setTarget}>----</div>
                </div>
            ) : (
                <div>
                    {taxiItems.map((item, id) => {
                        return (
                            <ListItem key={id}>
                                <div>{item.pid}</div>
                                <ItemInfo>
                                    <div>출발지 : {item.startPoint}</div>
                                    <div>목적지 : {item.endPoint}</div>
                                    <div>
                                        출발 시간 : {item.startDate} {item.startTime}
                                    </div>
                                </ItemInfo>
                                <CurrentMember>{item.currentHeadcnt}명</CurrentMember>
                                <JoinButton>Join</JoinButton>
                            </ListItem>
                        );
                    })}
                    <div ref={setTarget1}>----</div>
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
    font-family: "Noto Sans KR", sans-serif;
    font-weight: 100;
`;

const ListItem = styled.div`
    margin: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid black;
    border-radius: 10px;
`;

const ItemInfo = styled.div`
    margin: 10px;
    width: 250px;
`;

const CurrentMember = styled.div`
    margin-right: 10px;
`;

const JoinButton = styled.button`
    marign-right: 20px;
`;
