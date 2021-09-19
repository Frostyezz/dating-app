import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchComps, updateLocation, sendLike, sendRejection } from "../api";
import { distanceTo } from "geolocation-utils";
import { Link } from "react-router-dom";
import styles from "./CompSearch.module.scss";
import MatchPopUp from "../components/MatchPopUp";
import Radium, { StyleRoot } from "radium";
import { fadeIn } from "react-animations";
const anims = {
  fadeIn: {
    animation: "x .8s",
    animationName: Radium.keyframes(fadeIn, "fadeIn"),
  },
};

const CompSearch = () => {
  const { account } = useSelector((state) => state.account);
  const [loading, setLoading] = useState(0);
  const [location, setLocation] = useState();
  const [comps, setComps] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [match, setMatch] = useState();

  useEffect(() => {
    window.scroll(0, 0);
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position.coords);
    });
    fetchComps(account._id).then(({ data }) => {
      setComps(data);
      setLoading(loading + 1);
    });
  }, []);

  useEffect(() => {
    if (loading && comps.length) {
      const interval = setInterval(() => {
        let i = currentImg;
        i += 1;
        if (i >= comps[0].imgs.length) i = 0;
        setCurrentImg(i);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [currentImg, loading]);

  useEffect(() => {
    if (
      location &&
      (location.latitude !== account.coords.lat ||
        location.longitude !== account.coords.lon)
    ) {
      const data = {
        lat: location.latitude,
        lon: location.longitude,
        id: account._id,
      };
      return updateLocation(data).then(() => {});
    }
    return;
  }, [location]);

  const addLike = () => {
    sendLike(account._id, comps[0]._id).then(({ data }) => {
      console.log(data);
      if (data === "matched") {
        setMatch(comps[0]);
        setLoading(loading + 1);
      }
      removeComp();
    });
  };

  const addRejection = () => {
    sendRejection(account._id, comps[0]._id).then(() => removeComp());
  };

  const removeComp = () => {
    let copies = comps;
    copies.shift();
    setComps(copies);
    setCurrentImg(0);
    setLoading(loading + 1);
  };
  return (
    <div className={styles.cover}>
      {(!loading || !location || !comps.length) && !match ? (
        <div className={styles.loader}></div>
      ) : (
        <StyleRoot style={anims.fadeIn} className={styles.wrapper}>
          {!match ? (
            <>
              <div
                className={styles.slider}
                style={{ backgroundImage: `url(${comps[0].imgs[currentImg]})` }}
              >
                <div>
                  {comps[0].imgs.map((img, i) => (
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
                  <i
                    onClick={addLike}
                    className="icon pointer bi-heart-fill"
                  ></i>
                  <Link to={`/profile/${comps[0]._id}`}>
                    <i className="icon pointer bi-person-fill"></i>
                  </Link>
                  <i
                    onClick={addRejection}
                    className="icon pointer bi-x-lg"
                  ></i>
                </div>
              </div>
              <div className={styles.content}>
                <h1>
                  {comps[0].first} {comps[0].last[0]}.
                </h1>
                <h3>{comps[0].age} years old</h3>
                <h3>
                  {Math.floor(
                    distanceTo(
                      { lat: location.latitude, lon: location.longitude },
                      { lat: comps[0].coords.lat, lon: comps[0].coords.lon }
                    )
                  )
                    ? `${Math.floor(
                        distanceTo(
                          { lat: location.latitude, lon: location.longitude },
                          { lat: comps[0].coords.lat, lon: comps[0].coords.lon }
                        ).toFixed(0) / 1000
                      )} kms from you`
                    : "Less than 1 km from you"}
                </h3>
              </div>
            </>
          ) : (
            <MatchPopUp match={match} close={() => setMatch()} />
          )}
        </StyleRoot>
      )}
    </div>
  );
};

export default CompSearch;
