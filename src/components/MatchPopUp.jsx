import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./MatchPopUp.module.scss";
import Radium, { StyleRoot } from "radium";
import { pulse } from "react-animations";
const anims = {
  animation: "x 1s",
  animationName: Radium.keyframes(pulse, "pulse"),
};

const MatchPopUp = ({ match, close }) => {
  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      let i = currentImg;
      i += 1;
      if (i >= match.imgs.length) i = 0;
      setCurrentImg(i);
    }, 7000);
    return () => clearInterval(interval);
  }, [currentImg]);
  return (
    <StyleRoot style={anims}>
      <div
        className={styles.slider}
        style={{
          backgroundImage: `url(${match.imgs[currentImg]})`,
        }}
      >
        <div>
          {match.imgs.map((img, i) => (
            <i
              key={i}
              onClick={() => setCurrentImg(i)}
              className={
                i === currentImg
                  ? styles.active.concat(" icon pointer bi-dash-lg")
                  : "icon pointer bi-dash-lg"
              }
            ></i>
          ))}
        </div>
        <div>
          <h1>{match.first} likes you too!</h1>
          <Link to={`/chat/${match._id}`}>
            <button className={styles.btn}>START CHATTING</button>
          </Link>
          <button onClick={close} className={styles.btn}>
            KEEP LOOKING
          </button>
        </div>
      </div>
    </StyleRoot>
  );
};

export default MatchPopUp;
