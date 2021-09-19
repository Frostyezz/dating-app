import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchProfile } from "../api";
import styles from "./Profile.module.scss";
import Radium, { StyleRoot } from "radium";
import { fadeIn } from "react-animations";
const anims = {
  fadeIn: {
    animation: "x .8s",
    animationName: Radium.keyframes(fadeIn, "fadeIn"),
  },
};

const Profile = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    fetchProfile(id).then(({ data }) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        let i = currentImg;
        i += 1;
        if (i >= profile.imgs.length) i = 0;
        setCurrentImg(i);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [currentImg, loading]);
  return (
    <div className={styles.cover}>
      {loading ? (
        <div className={styles.loader}></div>
      ) : (
        <StyleRoot style={anims.fadeIn} className={styles.wrapper}>
          <div
            className={styles.slider}
            style={{ backgroundImage: `url(${profile.imgs[currentImg]})` }}
          >
            {profile.imgs.map((img, i) => (
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
          <div className={styles.content}>
            <h1>
              {profile.first} {profile.last[0]}.{" "}
            </h1>
            <h3>{profile.age} years old</h3>
            <hr />
            <p>{profile.bio}</p>
          </div>
        </StyleRoot>
      )}
    </div>
  );
};

export default Profile;
