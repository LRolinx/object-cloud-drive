import React from "react";
import {ConfigProvider } from "antd"
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.less";

export default ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <ConfigProvider theme={{ token: { colorPrimary: '#6266f5' } }}>
    <App />
  </ConfigProvider>
);
