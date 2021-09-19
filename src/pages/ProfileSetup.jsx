import React, { useRef, useState } from "react";
import styles from "./ProfileSetup.module.scss";
import { useDispatch } from "react-redux";
import { saveUser } from "../redux/actions/accountActions";
import { saveFile, saveInfo, saveImgs } from "../api/index";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import Radium, { StyleRoot } from "radium";
import { fadeIn } from "react-animations";
const anims = {
  fadeIn: {
    animation: "x .8s",
    animationName: Radium.keyframes(fadeIn, "fadeIn"),
  },
};

const ProfileSetup = () => {
  const { account } = useSelector((state) => state.account);
  const [redirect, setRedirect] = useState(false);
  const [step, setStep] = useState(0);
  const [err, setErr] = useState("");
  const [imgs, setImgs] = useState([]);
  const [hover, setHover] = useState(0);
  const first = useRef();
  const last = useRef();
  const age = useRef();
  const bio = useRef();
  const [options, setOptions] = useState({ gender: "male", looking: "male" });
  const dispatch = useDispatch();
  const removeImg = (i) => {
    let copies = imgs;
    copies.splice(i, 1);
    setImgs(copies);
    let s = step;
    s += 1;
    setStep(s);
  };

  const sendInfo = () => {
    if (
      !first.current.value &&
      !last.current.value &&
      !age.current.value &&
      !bio.current.value
    )
      return setErr("All fields must be filled!");
    if (age.current.value < 18)
      return setErr("You should have at least 18 years old to sign up!");
    setErr("");
    const info = {
      first: first.current.value,
      last: last.current.value,
      age: age.current.value,
      gender: options.gender,
      looking: options.looking,
      bio: bio.current.value,
    };
    saveInfo(info, account._id).then(({ data }) => {
      let s = step;
      s += 1;
      setStep(s);
    });
  };

  const sendFile = (file) => {
    if (!file.size > 4000000)
      return setErr("The size of the image exceeds 4MB!");

    saveFile(file).then(({ data }) => {
      let img = imgs;
      img.push(data.file.path);
      setImgs(img);
      let s = step;
      s += 1;
      setStep(s);
    });
  };

  const sendImgs = () => {
    if (!imgs.length)
      return setErr("You must upload at least one photo of yourself!");
    setErr("");
    saveImgs(imgs, account._id).then(({ data }) => {
      dispatch(saveUser(data));
      setRedirect(true);
    });
  };
  return (
    <div className={styles.cover}>
      {redirect && <Redirect to="/" />}
      <StyleRoot style={anims.fadeIn} className={styles.wrapper}>
        {step === 0 ? (
          <div>
            <h1>
              LET'S SETUP YOUR <span>PROFILE</span>!
            </h1>
            {err && <p className={styles.error}>{err}</p>}
            <div className={styles.container}>
              <div className={styles.input_group}>
                <label htmlFor="first">FIRST NAME</label>
                <input ref={first} id="first" type="text" />
              </div>
              <div className={styles.input_group}>
                <label htmlFor="last">LAST NAME</label>
                <input ref={last} id="last" type="text" />
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.input_group}>
                <label htmlFor="age">AGE</label>
                <input
                  max="100"
                  className={styles.age}
                  ref={age}
                  id="age"
                  type="number"
                />
              </div>
              <div className={styles.input_group}>
                <label htmlFor="gender">GENDER</label>
                <select
                  onChange={(e) =>
                    setOptions({ ...options, gender: e.target.value })
                  }
                  id="gender"
                >
                  <option value="male">MALE</option>
                  <option value="female">FEMALE</option>
                </select>
              </div>
              <div className={styles.input_group}>
                <label htmlFor="looking">LOOKING FOR</label>
                <select
                  onChange={(e) =>
                    setOptions({ ...options, looking: e.target.value })
                  }
                  id="looking"
                >
                  <option value="male">MALE</option>
                  <option value="female">FEMALE</option>
                </select>
              </div>
            </div>
            <div className={styles.input_group}>
              <label htmlFor="bio">TELL US SOMETHING ABOUT YOU</label>
              <textarea ref={bio} rows="3" id="bio" type="text" />
            </div>
            <button onClick={sendInfo} className={styles.btn}>
              NEXT STEP
            </button>
          </div>
        ) : (
          <div>
            <div className={styles.upload_container}>
              <h1>UPLOAD SOME PHOTOS OF YOURSELF!</h1>
              {err && <p className={styles.error}>{err}</p>}
              <div className={styles.row}>
                {imgs[0] ? (
                  <div
                    onMouseEnter={() => setHover(1)}
                    onMouseLeave={() => setHover(0)}
                    className={styles.img}
                    style={{ backgroundImage: `url(${imgs[0]})` }}
                  >
                    {hover === 1 && (
                      <i
                        onClick={() => removeImg(0)}
                        className="icon bi-x-circle-fill"
                      />
                    )}
                  </div>
                ) : (
                  <div className={styles.upload}>
                    <label htmlFor="u1">
                      <i className="icon bi-plus-circle" />
                    </label>
                    <input
                      onChange={(e) => sendFile(e.target.files[0])}
                      id="u1"
                      type="file"
                      accept="image/*"
                      hidden
                    />
                  </div>
                )}
                {imgs[1] ? (
                  <div
                    onMouseEnter={() => setHover(2)}
                    onMouseLeave={() => setHover(0)}
                    className={styles.img}
                    style={{ backgroundImage: `url(${imgs[1]})` }}
                  >
                    {hover === 2 && (
                      <i
                        onClick={() => removeImg(1)}
                        className="icon bi-x-circle-fill"
                      />
                    )}
                  </div>
                ) : (
                  <div className={styles.upload}>
                    <label htmlFor="u2">
                      <i className="icon bi-plus-circle" />
                    </label>
                    <input
                      onChange={(e) => sendFile(e.target.files[0])}
                      id="u2"
                      type="file"
                      accept="image/*"
                      hidden
                    />
                  </div>
                )}
                {imgs[2] ? (
                  <div
                    onMouseEnter={() => setHover(3)}
                    onMouseLeave={() => setHover(0)}
                    className={styles.img}
                    style={{ backgroundImage: `url(${imgs[2]})` }}
                  >
                    {hover === 3 && (
                      <i
                        onClick={() => removeImg(2)}
                        className="icon bi-x-circle-fill"
                      />
                    )}
                  </div>
                ) : (
                  <div className={styles.upload}>
                    <label htmlFor="u3">
                      <i className="icon bi-plus-circle" />
                    </label>
                    <input
                      onChange={(e) => sendFile(e.target.files[0])}
                      id="u3"
                      type="file"
                      accept="image/*"
                      hidden
                    />
                  </div>
                )}
                {imgs[3] ? (
                  <div
                    onMouseEnter={() => setHover(4)}
                    onMouseLeave={() => setHover(0)}
                    className={styles.img}
                    style={{ backgroundImage: `url(${imgs[3]})` }}
                  >
                    {hover === 4 && (
                      <i
                        onClick={() => removeImg(3)}
                        className="icon bi-x-circle-fill"
                      />
                    )}
                  </div>
                ) : (
                  <div className={styles.upload}>
                    <label htmlFor="u4">
                      <i className="icon bi-plus-circle" />
                    </label>
                    <input
                      onChange={(e) => sendFile(e.target.files[0])}
                      id="u4"
                      type="file"
                      accept="image/*"
                      hidden
                    />
                  </div>
                )}
              </div>
              <button className={styles.btn} onClick={sendImgs}>
                SAVE PROFILE
              </button>
            </div>
          </div>
        )}
      </StyleRoot>
    </div>
  );
};

export default ProfileSetup;
