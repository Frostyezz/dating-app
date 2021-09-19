import React, { useEffect, useState } from "react";
import { fetchProfile, fetchMatches } from "../api";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { saveUser } from "../redux/actions/accountActions";
import styles from "./Matches.module.scss";
import Radium, { StyleRoot } from "radium";
import { fadeIn } from "react-animations";
const anims = {
  fadeIn: {
    animation: "x .8s",
    animationName: Radium.keyframes(fadeIn, "fadeIn"),
  },
};

const Matches = () => {
  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState({
    users: [],
    chats: [],
  });

  useEffect(() => {
    window.scroll(0, 0);
    fetchProfile(account._id).then(({ data }) => {
      dispatch(saveUser(data));
    });
    fetchMatches(account.matches, account._id).then(({ data }) => {
      setLoading(false);
      setMatches({
        users: data.users,
        chats: data.chats,
      });
    });
  }, []);

  return (
    <div className={styles.cover}>
      {loading ? (
        <div className={styles.loader}></div>
      ) : (
        <StyleRoot style={anims.fadeIn} className={styles.wrapper}>
          <h1>YOUR MATCHES</h1>
          {!matches.users.length ? (
            <>
              <p>You don't have any matches yet!</p>
              <Link to="/comp">
                <button className={styles.btn}>FIND PEOPLE</button>
              </Link>
            </>
          ) : (
            <>
              {matches.users.map((match, i) => (
                <Link key={i} to={`/chat/${matches.chats[i]._id}`}>
                  <div className={styles.match}>
                    <div
                      className={styles.img}
                      style={{ backgroundImage: `url(${match.imgs[0]})` }}
                    ></div>
                    <div className={styles.info}>
                      <h1>
                        {match.first} {match.last[0]}.
                      </h1>
                      <p>Hi! How are you?</p>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </StyleRoot>
      )}
    </div>
  );
};

export default Matches;
