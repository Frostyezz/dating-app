import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";
import Radium, { StyleRoot } from "radium";
import { fadeInUp } from "react-animations";
const anims = {
  fadeInUp: {
    animation: "x .8s",
    animationName: Radium.keyframes(fadeInUp, "fadeInUp"),
  },
};

const NotFound = () => {
  return (
    <div className={styles.cover}>
      <StyleRoot style={anims.fadeInUp}>
        <i className="icon bi-exclamation-triangle-fill"></i>
        <h1>PAGE NOT FOUND</h1>
        <Link to="/">
          <button className={styles.btn}>BACK TO HOMEPAGE</button>
        </Link>
      </StyleRoot>
    </div>
  );
};

export default NotFound;
