import React, { useState } from "react";
import { ConfigProvider } from "antd";

import * as theme from '@/themes/light'

import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { LoginPage } from "./pages/login";
import { ReactRoutes } from "./routers";
import { BrowserRouter, HashRouter, Router } from "react-router-dom";

const App: React.FC = () => {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return <>

{/* <div className="container">
          <h1>Welcome to Tauri!</h1>

          <div className="row">
            <a href="https://vitejs.dev" target="_blank">
              <img src="/vite.svg" className="logo vite" alt="Vite logo" />
            </a>
            <a href="https://tauri.app" target="_blank">
              <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
            </a>
            <a href="https://reactjs.org" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
        </div> */}
    <React.StrictMode>
      <ConfigProvider theme={{ token: theme.lightTheme }}>
        <BrowserRouter>
          <ReactRoutes />
        </BrowserRouter>
        {/* <LoginPage/> */}
      </ConfigProvider>
    </React.StrictMode>
  </>
}

export default App;
