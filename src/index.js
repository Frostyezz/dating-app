import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.scss";
import Layout from "./Layout";
import store from "./redux/store";
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Layout />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
