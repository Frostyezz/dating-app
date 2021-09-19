import React, { useState, useEffect } from "react";
import { updateSettings } from "../api";
import { Redirect } from "react-router";
import styles from "./Settings.module.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { saveUser } from "../redux/actions/accountActions";
import Radium, { StyleRoot } from "radium";
import { fadeIn } from "react-animations";
const anims = {
  fadeIn: {
    animation: "x .8s",
    animationName: Radium.keyframes(fadeIn, "fadeIn"),
  },
};

const Settings = () => {
  const { account } = useSelector((state) => state.account);
  const [settings, setSettings] = useState({
    distance: account.distance,
    age: { minn: account.ageRange.minn, maxx: account.ageRange.maxx },
    looking: account.looking,
  });
  const [loading, setLoading] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const saveSettings = () => {
    setLoading(1);
    updateSettings(settings, account._id).then(({ data }) => {
      console.log(data);
      dispatch(saveUser(data));
      setLoading(2);
    });
  };
  return (
    <div className={styles.cover}>
      {loading === 1 ? (
        <div className={styles.loader}></div>
      ) : (
        <StyleRoot style={anims.fadeIn} className={styles.wrapper}>
          <h1>SETTINGS</h1>
          {loading === 2 && <Redirect to="/" />}
          <div className={styles.settings}>
            <div>
              <label htmlFor="slider">Maximum distance (km)</label>
              <div className="flex">
                <input
                  type="range"
                  min="1"
                  max="200"
                  id="slider"
                  value={settings.distance}
                  onChange={(e) =>
                    setSettings({ ...settings, distance: e.target.value })
                  }
                />
                <span>{settings.distance}</span>
              </div>
            </div>
            <div>
              <label htmlFor="age">Age range</label>
              <div>
                <input
                  value={settings.age.minn}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      age: { ...settings.age, minn: e.target.value },
                    })
                  }
                  type="number"
                  min="18"
                />
                <span>-</span>
                <input
                  value={settings.age.maxx}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      age: { ...settings.age, maxx: e.target.value },
                    })
                  }
                  type="number"
                  max="100"
                />
              </div>
            </div>
            <div>
              <label htmlFor="looking">Looking for</label>
              <select
                value={settings.looking}
                onChange={(e) =>
                  setSettings({ ...settings, looking: e.target.value })
                }
                id="looking"
              >
                <option value="male">MEN</option>
                <option value="female">WOMEN</option>
              </select>
            </div>
          </div>
          <button onClick={saveSettings} className={styles.btn}>
            SAVE SETTINGS
          </button>
        </StyleRoot>
      )}
    </div>
  );
};

export default Settings;
