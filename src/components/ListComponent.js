import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import "intersection-observer";
import axios from "axios";

const ListComponent = () => {
    const [items, setItems] = useState([]);
    const [target, setTarget] = useState(null);
    let currentId = 41;

    const fetchData = async () => {
        const response = await axios.get(`http://192.168.0.107:8080/parties`, {
            params: {
                lastId: currentId,
                amount: 2,
                type: "카풀",
                keyword: "",
            },
        });

        const data = await response.data;
        // console.log(response);
        setItems((prev) => prev.concat(data));
        currentId -= 2;
        // console.log(currentId);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 새로고침 시 state 초기화
    useEffect(() => {
        if (window.location.reload) {
            setItems([]);
            currentId = 41;
        }
    }, [window.location.reload]);

    useEffect(() => {
        console.log(items);
    }, [items]);

    useEffect(() => {
        let observer;
        if (target) {
            const onIntersect = async ([entry], observer) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    if (currentId < 23) {
                        return () => observer && observer.disconnect();
                    }
                    await fetchData();
                    observer.observe(entry.target);
                }
            };
            observer = new IntersectionObserver(onIntersect, { threshold: 0.7 });
            observer.observe(target);
        }
        return () => observer && observer.disconnect();
    }, [target]);

    return (
        <Main>
            {items.map((item, id) => {
                return (
                    <div key={id}>
                        <div>{item.pid}</div>
                        <div>{item.startPoint}</div>
                    </div>
                );
            })}
            <div ref={setTarget}>this is the target</div>
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
