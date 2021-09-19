import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router";
import { signUp } from "../api/index";
import { saveUser } from "../redux/actions/accountActions";
import { Link } from "react-router-dom";
import styles from "./Signup.module.scss";
import Radium, { StyleRoot } from "radium";
import { fadeIn } from "react-animations";
const anims = {
  fadeIn: {
    animation: "x .8s",
    animationName: Radium.keyframes(fadeIn, "fadeIn"),
  },
};

const Signup = () => {
  useEffect(() => {
    window.scroll(0, 0);
    navigator.geolocation.getCurrentPosition((position) =>
      setLocation(position.coords)
    );
  }, []);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [redirect, setRedirect] = useState(false);
  const email = useRef();
  const password = useRef();
  const confirmed = useRef();

  const submit = () => {
    if (
      !email.current.value ||
      !password.current.value ||
      !confirmed.current.value
    )
      return setError("All fields must be filled!");
    if (!email.current.value.includes("@"))
      return setError("Please provide a valid email address!");
    if (password.current.value !== confirmed.current.value)
      return setError("Passwords do not match!");
    if (password.current.value.length > 16 || password.current.value.length < 4)
      return setError("Your password should have between 4 and 16 characters!");
    setError("");
    const account = {
      email: email.current.value,
      password: password.current.value,
      coords: { lat: location.latitude, lon: location.longitude },
    };
    signUp(account).then(({ data }) => {
      if (data) {
        sessionStorage.setItem("user", JSON.stringify(data));
        dispatch(saveUser(data));
        setRedirect(true);
      } else setError("This email address is already used!");
    });
  };

  return (
    <div className={styles.cover}>
      <StyleRoot style={anims.fadeIn} className={styles.wrapper}>
        <h1>CREATE ACCOUNT</h1>
        {redirect && <Redirect to="/profile_setup" />}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.input_group}>
          <label htmlFor="mail">EMAIL</label>
          <input ref={email} id="mail" type="email" />
        </div>
        <div className={styles.input_group}>
          <label htmlFor="pass">PASSWORD</label>
          <input ref={password} id="pass" type="password" />
        </div>
        <div className={styles.input_group}>
          <label htmlFor="confirm">CONFIRM PASSWORD</label>
          <input ref={confirmed} id="confirm" type="password" />
        </div>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
        <button onClick={submit} className={styles.btn}>
          SIGN UP
        </button>
      </StyleRoot>
    </div>
  );
};

export default Signup;
