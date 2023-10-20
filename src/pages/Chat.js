import React, { useCallBack, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { userId, isChatOnState } from "../atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { customAPI } from "../customAPI";

import * as StompJs from "@stomp/stompjs";

const ChatRoom = (props) => {
  const listitem = props.item;
  let navigate = useNavigate();
  const id = useRecoilValue(userId);
  const token = sessionStorage.getItem("accessToken");
  const [client, setClient] = useState(null);
  const [chat, setChat] = useState("");
  const [chatList, setChatList] = useState([]);
  const [isChatOn, setIsChatOn] = useRecoilState(isChatOnState);
  const [top, setTop] = useState(
    window.scrollY + window.innerHeight / 2 + "px"
  );

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setTop(scrollTop + window.innerHeight / 2 + "px"); // top 값을 문자열로 변경
  };

  // const msgBox = chatList.map((item, idx) => {
  //   if (item.sender === id) {
  //     return (
  //       <div key={idx}>
  //         <ChatItem>{item.message}</ChatItem>
  //         <ChatItem>{item.time}</ChatItem>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div key={idx}>
  //         <ChatItem1>{item.message}</ChatItem1>
  //         <ChatItem1>{item.time}</ChatItem1>
  //       </div>
  //     );
  //   }
  // });

  const msgBox = chatList.map((item, idx) => {
    const isUser = item.sender === id;

    const messageContainerStyle = {
      display: "flex",
      flexDirection: isUser ? "row" : "row-reverse",
      width: "100%",
    };

    const set = {
      display: "flex",
      flexDirection: "column",
    };

    const set1 = {
      fontFamily: "Noto Sans KR , sans-serif",
      fontSize: "15px",
      fontWeight: "bold",
      border: "2px solid #0583f2",
      borderRadius: "10px",
      padding: "8px",
      margin: "10px",
      display: "flex",
      flexDirection: isUser ? "row" : "row-reverse",
    };

    return (
      <div key={idx} style={messageContainerStyle}>
        <div style={set}>
          <span style={set1}>{item.message}</span>
        </div>
      </div>
    );
  });

  const connect = () => {
    try {
      const clientdata = new StompJs.Client({
        brokerURL: "ws://localhost:8080/stomp",
        // connectHeaders: {
        // 토큰이 혹시 필요하면 여기에
        // },
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncomings: 4000,
        heartbeatOutgoing: 4000,
      });

      clientdata.onConnect = function () {
        clientdata.subscribe(`/sub/chat/room/${listitem.pid}`, callback);
      };

      clientdata.activate();
      setClient(clientdata);
    } catch (err) {
      console.log(err);
    }
  };

  const disConnect = () => {
    if (client === null) {
      return;
    }
    client.deactivate();
  };

  const callback = (msg) => {
    if (msg.body) {
      console.log(msg.body);
      let m = JSON.parse(msg.body);
      console.log(m);
      setChatList((chats) => [...chats, m]);
    }
  };

  const sendChat = () => {
    if (chat === "") {
      return;
    }

    client.publish({
      destination: `/pub/chat/room/${listitem.pid}`,
      body: JSON.stringify({
        message: chat,
        sender: id,
      }),
    });

    setChat("");
  };

  const getHistory = () => {
    console.log(listitem.pid);
    try {
      const data = customAPI.get(`/chat/list/${listitem.pid}`);
      data.then((result) => {
        result.data.map((item) => {
          setChatList((chats) => [...chats, item]);
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setChatList([]);
    console.log(listitem);
    getHistory();
    connect();

    return () => disConnect();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트될 때 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const onChangeChat = (e) => {
    setChat(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onClickChatOff = () => {
    setIsChatOn(false);
  };

  return (
    <Container top={top}>
      <Header>
        <CloseButton onClick={onClickChatOff}>닫기</CloseButton>
      </Header>

      <ChatBox>{msgBox}</ChatBox>

      <InputBox
        type="text"
        id="msg"
        value={chat}
        placeholder="메시지 보내기"
        onChange={onChangeChat}
        onKeyDown={(ev) => {
          if (ev.keyCode === 13) {
            sendChat();
          }
        }}
      />
    </Container>
  );
};

export default ChatRoom;

const Container = styled.div`
  width: 800px;
  min-width: 300px;
  max-width: 800px;
  height: 700px;
  position: absolute;
  top: ${(props) => props.top};
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  border: 2px solid #0583f2;
  overflow: hidden;
  z-index: 1000;
`;
const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  z-index: 1001;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  left: 720px;
  padding: 10px;

  background-color: #fff;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);

  font-family: "Noto Sans KR", sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #0583f2;

  border: none;
  border-radius: 10px;

  :hover {
    background-color: whitesmoke;
  }
`;

const ChatBox = styled.button`
  display: flex;
  flex-direction : column;
  width : 800px;
  margin-top: 60px;
  padding: 30px; 
  overflow-y: scroll; 
  height: 580px; 
  background-color: #fff;
  border: none;
  ::-webkit-scrollbar {
    width: 0;
    display: none;
`;

const InputBox = styled.input`
  padding: 10px;
  margin: 10px;
  margin-left: 20px;
  margin-right: 20px;
  position: fixed;
  border-radius: 15px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;

  font-family: "Noto Sans KR", sans-serif;
  font-size: 16px;
  font-weight: bold;
`;
