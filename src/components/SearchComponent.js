import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { customAPI } from "../customAPI";
import { listItemInfo } from "../atoms";
import { useRecoilState } from "recoil";

const SearchComponent = () => {
  const [dest, setDest] = useState("");
  const [list, setList] = useState([]);
  const [itemInfo, setItemInfo] = useRecoilState(listItemInfo);

  const getData = async () => {
    try {
      const response = await customAPI.get(`/parties`, {
        params: {
          keyword: dest,
        },
      });

      const data = await response.data;
      setList(data);
    } catch (e) {
      console.log(e);
    }
  };

  const listButtonClick = (item) => {
    setItemInfo(item);
    setList([]);
  };

  useEffect(() => {
    if (dest !== "") {
      getData();
    } else {
      setList([]);
    }
  }, [dest]);

  return (
    <Main>
      <DestinationInput
        type="text"
        name="inputName"
        placeholder="목적지를 입력하시오"
        onChange={(e) => {
          setDest(e.target.value);
        }}
      />
      {list.map((item, id) => (
        <div key={id}>
          <Test onClick={() => listButtonClick(item)}>{item.startPoint}</Test>
        </div>
      ))}
    </Main>
  );
};

export default SearchComponent;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  min-height: 40px;
  z-index: 999;
  border-radius: 15px;
  border: 2px solid #0583f2;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  background-color: white;
`;

const DestinationInput = styled.input`
  width: 500px;
  height: 40px;
  text-indent: 20px;
  font-size: 16px;
  font-family: "Noto Sans KR", sans-serif;
  border: none;
  overflow: hidden;

  &:focus {
    outline: none; /* 테두리 숨김 */
  }
`;

const Test = styled.div`
  text-indent: 20px;
  font-family: "Noto Sans KR", sans-serif;
  margin-bottom: 5px;

  &:hover {
    background-color: whitesmoke;
    transition: all 0.3s ease;
    cursor: pointer;
  }
`;
