import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";
import CompSearch from "./pages/CompSearch";
import Settings from "./pages/Settings";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import styles from "./Layout.module.scss";
import NotAllowed from "./pages/NotAllowed";
import NotFound from "./pages/NotFound";
import { useSelector } from "react-redux";

const Layout = () => {
  const { account } = useSelector((state) => state.account);
  return (
    <BrowserRouter>
      <div className={styles.wrapper}>
        <Nav></Nav>
        <Switch>
          <Route path="/" exact render={() => <Home></Home>}></Route>
          <Route path="/signup" render={() => <Signup></Signup>}></Route>
          <Route path="/login" render={() => <Login></Login>}></Route>
          <Route
            path="/profile_setup"
            render={() => <ProfileSetup></ProfileSetup>}
          ></Route>
          <Route
            path="/profile/:id"
            render={() =>
              Object.keys(account).length ? <Profile></Profile> : <NotAllowed />
            }
          ></Route>
          <Route
            path="/comp"
            render={() =>
              Object.keys(account).length ? (
                <CompSearch></CompSearch>
              ) : (
                <NotAllowed />
              )
            }
          ></Route>
          <Route
            path="/settings"
            render={() =>
              Object.keys(account).length ? (
                <Settings></Settings>
              ) : (
                <NotAllowed />
              )
            }
          ></Route>
          <Route
            path="/matches"
            render={() =>
              Object.keys(account).length ? <Matches></Matches> : <NotAllowed />
            }
          ></Route>
          <Route
            path="/chat/:id"
            render={() =>
              Object.keys(account).length ? <Chat></Chat> : <NotAllowed />
            }
          ></Route>
          <Route component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Layout;
