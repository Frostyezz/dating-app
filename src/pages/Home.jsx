import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Home.module.scss";
import Radium, { StyleRoot } from "radium";
import { fadeInDown } from "react-animations";
const anims = {
  fadeInDown: {
    animation: "x 1s",
    animationName: Radium.keyframes(fadeInDown, "fadeInDown"),
  },
};

const Home = () => {
  const { account } = useSelector((state) => state.account);
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <div className={styles.header}>
      <StyleRoot>
        <div style={anims.fadeInDown} className={styles.heading}>
          <h1>Greetify</h1>
          {Object.keys(account).length !== 0 && (
            <h2>Welcome, {account.first}</h2>
          )}
          <Link to={Object.keys(account).length !== 0 ? "/comp" : "/signup"}>
            <button className={styles.btn}>
              {Object.keys(account).length !== 0
                ? "FIND PEOPLE"
                : "CREATE AN ACCOUNT"}
            </button>
          </Link>
          <Link to="/login">
            <button className={styles.btn}>
              {Object.keys(account).length !== 0 ? "YOUR MATCHES" : "LOG IN"}
            </button>
          </Link>
        </div>
      </StyleRoot>
      <div className={styles.scroll}>
        <i className="icon pointer bi-chevron-double-down"></i>
      </div>
    </div>
  );
};

export default Home;
