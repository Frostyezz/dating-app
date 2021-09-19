import React, { useState, useEffect, useRef } from "react";
import { fetchProfileByChatId, fetchHistory } from "../api";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import styles from "./Chat.module.scss";
import Radium, { StyleRoot } from "radium";
import { fadeIn, fadeInUp } from "react-animations";
const anims = {
  fadeIn: {
    animation: "x .8s",
    animationName: Radium.keyframes(fadeIn, "fadeIn"),
  },
  fadeInUp: {
    animation: "x .5s",
    animationName: Radium.keyframes(fadeInUp, "fadeInUp"),
  },
};

let socket;
const ENDPOINT = "https://api-greetify.herokuapp.com/";
let s = { message: "", sender: "" };
const Chat = () => {
  const { account } = useSelector((state) => state.account);
  const { id } = useParams();
  const [match, setMatch] = useState();
  const [loading, setLoading] = useState(0);
  const [texts, setTexts] = useState([]);
  const [msg, setMsg] = useState();
  const text = useRef();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchProfileByChatId(id, account._id).then(({ data }) => {
      setMatch(data);
      setLoading(loading + 1);
      scrollToBottom();
    });
    fetchHistory(id).then(({ data }) => {
      setTexts(data);
    });
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("connect", () => {});
    socket.emit("subscribe", id);
    return () => socket.off();
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("message", (message) => {
      if (message.sender !== account._id) {
        setMsg(message);
      }
    });
  }, [texts]);

  useEffect(() => {
    if (msg)
      if (s.message !== msg.message) {
        setTexts([...texts, msg]);
        s = { message: msg.message, sender: msg.sender };
      }
    scrollToBottom();
  }, [msg]);

  const sendText = () => {
    if (text.current.value) {
      setTexts([
        ...texts,
        { message: text.current.value, sender: account._id },
      ]);
      socket.emit("sendMessage", {
        message: text.current.value,
        sender: account._id,
        id,
      });
      scrollToBottom();
      text.current.value = "";
    }
  };
  return (
    <div className={styles.cover}>
      {!loading ? (
        <div className={styles.loader}></div>
      ) : (
        <StyleRoot style={anims.fadeIn} className={styles.wrapper}>
          <div className={styles.nav}>
            <Link to="/matches">
              <i className="icon poinet bi-arrow-left-circle-fill"></i>
            </Link>
            <h1>
              <Link to={`/profile/${match._id}`}>{match.first}</Link>
            </h1>
          </div>
          <div className={styles.chat}>
            {!texts.length ? (
              <div className={styles.noMsg}>
                <div className={styles.matches}>
                  <div
                    style={{ backgroundImage: `url(${match.imgs[0]})` }}
                  ></div>
                  <div
                    style={{ backgroundImage: `url(${account.imgs[0]})` }}
                  ></div>
                </div>
                <div className={styles.text}>
                  <h1>You and {match.first} are a match!</h1>
                  <p>Be the first to start the conversation!</p>
                </div>
              </div>
            ) : (
              <>
                {texts.map((txt, i) => {
                  return (
                    <div
                      key={i}
                      style={anims.fadeInUp}
                      className={
                        txt.sender === account._id
                          ? styles.msgUser
                          : styles.msgMatch
                      }
                    >
                      <p>{txt.message}</p>
                    </div>
                  );
                })}
                <div className={styles.scrolldiv} ref={messagesEndRef}>
                  dasda
                </div>
              </>
            )}
          </div>
          <div className={styles.type}>
            <input
              ref={text}
              onKeyPress={(e) => e.key === "Enter" && sendText()}
              type="text"
              placeholder="Write something..."
            />
            <i
              onClick={sendText}
              className="icon pointer bi-arrow-return-right"
            ></i>
          </div>
        </StyleRoot>
      )}
    </div>
  );
};

export default Chat;
