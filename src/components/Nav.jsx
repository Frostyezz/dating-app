import React from "react";
import { Link } from "react-router-dom";
import styles from "./Nav.module.scss";
import { useSelector } from "react-redux";

const Nav = () => {
  const { account } = useSelector((state) => state.account);
  return (
    <div className={styles.wrapper}>
      <Link to="/">
        <i className="icon pointer bi-house" />
      </Link>
      <Link to={"/profile/".concat(account._id)}>
        <i className="icon pointer bi-person-circle"></i>
      </Link>
      <Link to="/comp">
        <i className="icon pointer bi-person-badge"></i>
      </Link>
      <Link to="/matches">
        <i className="icon pointer bi-chat-square-dots"></i>
      </Link>
      <Link to="/settings">
        <i className="icon pointer bi-gear"></i>
      </Link>
    </div>
  );
};

export default Nav;
