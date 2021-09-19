import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotAllowed.module.scss";
import Radium, { StyleRoot } from "radium";
import { fadeInUp } from "react-animations";
const anims = {
  fadeInUp: {
    animation: "x .8s",
    animationName: Radium.keyframes(fadeInUp, "fadeInUp"),
  },
};

const NotAllowed = () => {
  return (
    <div className={styles.cover}>
      <StyleRoot style={anims.fadeInUp}>
        <i className="icon bi-exclamation-triangle-fill"></i>
        <h1>You need to be signed into an account to view this page!</h1>
        <Link to="/signup">
          <button className={styles.btn}>CREATE AN ACCOUNT</button>
        </Link>
        <Link to="/login">
          <button className={styles.btn}>SIGN IN</button>
        </Link>
      </StyleRoot>
    </div>
  );
};

export default NotAllowed;
