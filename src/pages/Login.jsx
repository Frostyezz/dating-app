import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router";
import { signIn } from "../api/index";
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

const Login = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const email = useRef();
  const password = useRef();
  const submit = () => {
    if (!email.current.value || !password.current.value)
      return setError("All fields must be filled!");
    setError("");
    const account = {
      email: email.current.value,
      password: password.current.value,
    };

    signIn(account).then(({ data }) => {
      if (data) {
        sessionStorage.setItem("user", JSON.stringify(data));
        dispatch(saveUser(data));
        setRedirect(true);
      } else setError("Invalid email or password!");
    });
  };
  return (
    <div className={styles.cover}>
      <StyleRoot style={anims.fadeIn} className={styles.wrapper}>
        <h1>SIGN INTO YOUR ACCOUNT</h1>
        {redirect && <Redirect to="/" />}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.input_group}>
          <label htmlFor="mail">EMAIL</label>
          <input ref={email} id="mail" type="email" />
        </div>
        <div className={styles.input_group}>
          <label htmlFor="pass">PASSWORD</label>
          <input ref={password} id="pass" type="password" />
        </div>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <button onClick={submit} className={styles.btn}>
          SIGN IN
        </button>
      </StyleRoot>
    </div>
  );
};

export default Login;
