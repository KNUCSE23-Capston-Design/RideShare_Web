import { useState, useEffect } from "react";
import styled from "styled-components";
import "intersection-observer";
import { customAPI } from "../customAPI";
import { isLoggedInState } from "../atoms";
import { useRecoilValue } from "recoil";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// problem : 스크롤 바를 체크하는 target1, target이 서로 연동됨
const AllListComponent = () => {
  const [listItems, setListItems] = useState([]);
  const [target, setTarget] = useState(null);
  const isLoggedIn = useRecoilValue(isLoggedInState);

  let itemId = 0;

  const showPopupMessage = () => {
    toast.success("파티에 참여하였습니다.", {
      autoClose: 1000, // 자동 닫힘 지속 시간을 1초로 설정
      onClose: handleClose, // 토스트가 닫히면 글쓰기 창 닫기() 실행
    });
  };

  const handleClose = () => {
    window.location.reload();
  };

  const getInitialData = async () => {
    // console.log("initial data");
    try {
      const response = await customAPI.get(`/parties`, {
        params: {
          amount: 1,
        },
      });

      const data = await response.data;

      if (data.length === 0) {
        itemId = -1;
        return;
      }

      itemId = data[data.length - 1].pid;
      setListItems((prev) => prev.concat(data));

      if (itemId === 0) {
        itemId = -1;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    if (itemId === -1) {
      return;
    }

    try {
      const response = await customAPI.get(`/parties`, {
        params: {
          lastId: itemId,
          amount: 2,
        },
      });

      const data = await response.data;

      if (data.length === 0) {
        itemId = -1;
      } else {
        itemId = data[data.length - 1].pid;
        setListItems((prev) => prev.concat(data));
      }

      console.log(data);
    } catch (err) {
      console.log("전체 리스트 데이터 호출 에러" + err.message);
    }
  };

  const onClickJoinParty = async (item) => {
    try {
      const response = await customAPI.put(`/parties/${item.pid}/participate`);

      if (response.status === 200) {
        console.log("Successfully joined party", response);
      }

      showPopupMessage();
    } catch (e) {
      toast.success(e.response.data.message, {
        autoClose: 1000, // 자동 닫힘 지속 시간을 1초로 설정
        // onClose: handleClose, // 토스트가 닫히면 글쓰기 창 닫기() 실행
      });
    }
  };

  useEffect(() => {
    let observer;

    setListItems([]);

    if (target) {
      setListItems([]);

      const onIntersect = async ([entry], observer) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);

          if (itemId === 0) {
            await getInitialData();
          } else if (itemId === -1) {
            return () => observer && observer.disconnect();
          } else {
            await fetchData();
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
  }, [target]);

  return (
    <Main>
      {listItems.map((item, id) => {
        return (
          <ListItem key={id}>
            {item.type === "카풀" ? (
              <ListCarID>{item.pid}</ListCarID>
            ) : (
              <ListTaxiID>{item.pid}</ListTaxiID>
            )}
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
            {isLoggedIn ? (
              <JoinButton onClick={() => onClickJoinParty(item)}>
                참여
              </JoinButton>
            ) : null}
          </ListItem>
        );
      })}

      <div ref={setTarget} style={{ fontSize: "0.01px" }}>
        -
      </div>
      {listItems.length === 0 ? (
        <EmptyListBox>리스트가 존재하지 않습니다.</EmptyListBox>
      ) : null}
      <ToastContainer />
    </Main>
  );
};

export default AllListComponent;

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
