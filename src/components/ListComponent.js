import { useState, useEffect } from "react";
import styled from "styled-components";
import { showCarpoolState, showTaxiState } from "../atoms";
import { useRecoilValue } from "recoil";
import "intersection-observer";
import { customAPI } from "../customAPI";

// problem : 스크롤 바를 체크하는 target1, target이 서로 연동됨
const ListComponent = () => {
  const [carpoolItems, setCarpoolItems] = useState([]);
  const [taxiItems, setTaxiItems] = useState([]);

  const [target, setTarget] = useState(null);
  const [target1, setTarget1] = useState(null);

  const isCarpoolshow = useRecoilValue(showCarpoolState);
  const isTaxishow = useRecoilValue(showTaxiState);

  let carpoolId = 0;
  let taxiId = 0;

  //useEffect에 의해 observer와 묶여서 매번 호출되는 문제 개선 필요
  // 요청 API 반환 타입은 number 이다.
  // const dataExists = async (type) => {
  //   if (type === "카풀") {
  //     const carpoolCount = await customAPI.get(`/parties/count`, {
  //       params: {
  //         type: type,
  //       },
  //     });
  //     // console.log(carpoolCount);
  //     if (carpoolCount.data === 0) {
  //       carpoolId = -1;
  //     }
  //   } else if (type === "택시") {
  //     const taxiCount = await customAPI.get(`/parties/count`, {
  //       params: {
  //         type: type,
  //       },
  //     });

  //     if (taxiCount.data === 0) {
  //       taxiId = -1;
  //     }
  //   }
  // };

  const getInitialData = async (type) => {
    // console.log("initial data");
    try {
      const response = await customAPI.get(`/parties`, {
        params: {
          amount: 1,
          type: type,
          keyword: "",
        },
      });

      const data = await response.data;

      if (type === "카풀") {
        if (data.length === 0) {
          carpoolId = -1;
          return;
        }

        carpoolId = data[data.length - 1].pid;
        setCarpoolItems((prev) => prev.concat(data));
        // console.log(carpoolId);

        if (carpoolId === 0) {
          carpoolId = -1;
        }
      } else {
        if (data.length === 0) {
          taxiId = -1;
          return;
        }

        taxiId = data[data.length - 1].pid;
        setTaxiItems((prev) => prev.concat(data));
        if (taxiId === 0) {
          taxiId = -1;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async (type) => {
    // console.log("Fetching data");

    if (type === "카풀") {
      // 데이터가 더 이상 없을 때
      if (carpoolId === -1) {
        return;
      }

      try {
        const response = await customAPI.get(`/parties`, {
          params: {
            lastId: carpoolId,
            amount: 2,
            type: type,
            keyword: "",
          },
        });

        const data = await response.data;

        if (data.length === 0) {
          carpoolId = -1;
        } else {
          carpoolId = data[data.length - 1].pid;
          setCarpoolItems((prev) => prev.concat(data));
        }
      } catch (err) {
        console.log("카풀 데이터 호출 에러" + err.message);
      }
    } else if (type === "택시") {
      // 데이터가 더 이상 없을 때
      if (taxiId === -1) {
        return;
      }

      try {
        const response = await customAPI.get(`/parties`, {
          params: {
            lastId: taxiId,
            amount: 2,
            type: type,
            keyword: "",
          },
        });

        const data = await response.data;

        if (data.length === 0) {
          taxiId = -1;
        } else {
          taxiId = data[data.length - 1].pid;
          setTaxiItems((prev) => prev.concat(data));
        }
      } catch (err) {
        console.log("택시 데이터 호출 에러" + err.message);
      }
    }
  };

  useEffect(() => {
    let observer;

    if (target && isCarpoolshow) {
      setCarpoolItems([]);

      const onIntersect = async ([entry], observer) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);

          if (carpoolId === 0) {
            await getInitialData("카풀");
          } else if (carpoolId === -1) {
            return () => observer && observer.disconnect();
          } else {
            await fetchData("카풀");
          }
          observer.observe(entry.target);
        }
      };
      observer = new IntersectionObserver(onIntersect, { threshold: 0.7 });
      observer.observe(target);
    }

    return () => {
      observer && observer.disconnect();
    };
  }, [target, isCarpoolshow]);

  useEffect(() => {
    let observer1;

    if (target1 && !isCarpoolshow) {
      setTaxiItems([]);

      const onIntersect = async ([entry], observer1) => {
        if (entry.isIntersecting) {
          observer1.unobserve(entry.target);

          if (taxiId === 0) {
            await getInitialData("택시");
          } else if (taxiId === -1) {
            return () => observer1 && observer1.disconnect();
          } else {
            await fetchData("택시");
          }
          observer1.observe(entry.target);
        }
      };
      observer1 = new IntersectionObserver(onIntersect, { threshold: 0.7 });
      observer1.observe(target1);
    }

    return () => {
      observer1 && observer1.disconnect();
    };
  }, [isCarpoolshow, target1]);

  // useEffect(() => {
  //   let observer1;

  //   if (target1 && !isCarpoolshow) {
  //     setTaxiItems([]);

  //     const onIntersect = async ([entry], observer1) => {
  //       if (entry.isIntersecting) {
  //         observer1.unobserve(entry.target);

  //         if (taxiId === 0) {
  //           await getInitialData("택시");
  //         } else if (taxiId === -1) {
  //           return () => observer1 && observer1.disconnect();
  //         } else {
  //           await fetchData("택시");
  //         }
  //         observer1.observe(entry.target);
  //       }
  //     };
  //     observer1 = new IntersectionObserver(onIntersect, { threshold: 0.7 });
  //     observer1.observe(target1);
  //   }
  //   return () => observer1 && observer1.disconnect();
  // }, [target1, isCarpoolshow]);

  // 파티 참여
  // 자신이 만든 파티에 자신이 참여하는 상황 배제 필요
  const onClickJoinParty = async (item) => {
    try {
      const response = await customAPI.put(`/parties/${item.pid}/participate`);

      if (response.status === 200) {
        console.log("Successfully joined party", response);
      }
    } catch (e) {
      console.log("Failed to join party", e);
    }
  };

  return (
    // 각 listItem의 id는 코드 동작을 확인하기 위해 임시로 넣은 것이다.
    <Main>
      {isCarpoolshow
        ? carpoolItems.map((item, id) => {
            return (
              <ListItem key={id}>
                <ListCarID>{item.pid}</ListCarID>

                <ItemInfo>
                  <ItemContent>출발지 : {item.startPoint}</ItemContent>
                  <ItemContent>목적지 : {item.endPoint}</ItemContent>
                  <ItemContent>
                    출발 시간 : {item.startDate} {item.startTime}
                  </ItemContent>
                </ItemInfo>
                <CurrentMember>
                  {item.currentHeadcnt}/{item.totalHeadcnt} 명
                </CurrentMember>
                <JoinButton onClick={() => onClickJoinParty(item)}>
                  참여
                </JoinButton>
              </ListItem>
            );
          })
        : taxiItems.map((item, id) => {
            return (
              <ListItem key={id}>
                <ListTaxiID>{item.pid}</ListTaxiID>

                <ItemInfo>
                  <ItemContent>출발지 : {item.startPoint}</ItemContent>
                  <ItemContent>목적지 : {item.endPoint}</ItemContent>
                  <ItemContent>
                    출발 시간 : {item.startDate} {item.startTime}
                  </ItemContent>
                </ItemInfo>
                <CurrentMember>
                  {item.currentHeadcnt}/{item.totalHeadcnt} 명
                </CurrentMember>
                <JoinButton onClick={() => onClickJoinParty(item)}>
                  참여
                </JoinButton>
              </ListItem>
            );
          })}
      {isCarpoolshow ? (
        <div ref={setTarget} style={{ height: "0px" }}>
          -
        </div>
      ) : (
        <div ref={setTarget1} style={{ height: "0px" }}>
          -
        </div>
      )}

      {/* <div ref={setTarget}>this is the target</div> */}
    </Main>
  );
};

export default ListComponent;

// observer가 인식하는 뷰포트의 최대 크기는 100vh이다 그러나 화면에 맞추기 위해서는 threshold 값을 조정해야 한다.
const Main = styled.div`
  postion: absolute;
  top: 0;
  left: 0;
  width: 700px;
  height: calc(100vh - 90px);
  overflow-y: scroll;
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 100;
  z-index: 999;

  ::-webkit-scrollbar {
    width: 8px; /* 스크롤바의 너비 */
  }
  ::-webkit-scrollbar-thumb {
    height: 30%; /* 스크롤바의 길이 */
    background: rgba(33, 122, 244, 0.3); /* 스크롤바의 색상 */

    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(33, 122, 244, 0.1); /*스크롤바 뒷 배경 색상*/
  }
`;

const ListItem = styled.div`
  margin: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-top: 1px solid #eee;
`;

const ItemContent = styled.div`
  font-size: 15px;
`;

const ListCarID = styled.div`
  font-weight: bold;
  // background-color: #b8d7fb;
  border: 2px solid #0583f2;
  border-radius: 10px;
  font-size: 20px;
  padding: 15px 15px;
  width: 25px;
  text-align: center;
`;

const ListTaxiID = styled.div`
  font-weight: bold;
  //background-color: yellow;
  border: 2px solid #e3d700;
  border-radius: 10px;
  font-size: 20px;
  padding: 15px 15px;
  width: 25px;
  text-align: center;
`;

const ItemInfo = styled.div`
  margin: 10px;
  width: 240px;
  font-weight: bold;

  @media (max-width: 1150px) {
    //브라우저 크기 조절시 사라짐
    display: none;
  }
`;

const CurrentMember = styled.div`
  margin-right: 10px;
  font-weight: bold;
  font-size: 15px;

  @media (max-width: 600px) {
    //브라우저 크기 조절시 사라짐
    display: none;
  }
`;

const EmptyListBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 25px;
  color: gray;
`;

const JoinButton = styled.button`
  background-color: white;
  border-radius: 10px;
  padding: 10px 10px;
  text-align: center;
  margin-right: 18px;
  font-weight: bold;
  cursor: pointer; //마우스 포인터 변화

  transition: background-color 0.3s;

  &:hover {
    //버튼 클릭 효과
    background-color: #35a0ff;
  }
`;
