import React, { useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { IntlProvider } from 'react-intl';

import * as myTheme from '@/themes/light'
import { darkTheme } from '@/themes/dark'

import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { LoginPage } from "./pages/login";
import { ReactRoutes } from "./routers";
import { BrowserRouter } from "react-router-dom";
import zh from '@/locales/zh'
import { InjectContextProvider } from "./components/InjectContextProvider";

const App: React.FC = () => {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [osThemeModal, setOsThemeModal] = useState<'light' | 'dark'>()

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    let matchMedia = window.matchMedia('(prefers-color-scheme:dark)')
    // 监听主题变更
    matchMedia.onchange = function (e) {
      console.log('prefers-color-scheme', e);
      setOsThemeModal(e.matches ? 'dark' : 'light')
    }

    setOsThemeModal(matchMedia.matches ? 'dark' : 'light')
  }, [])

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
      <ConfigProvider theme={{ token: osThemeModal === 'dark' ? darkTheme : myTheme.lightTheme}} componentSize={'large'}>
        <IntlProvider locale={'zh'} messages={zh}>
          <InjectContextProvider>
            <BrowserRouter>
              <ReactRoutes />
            </BrowserRouter>
          </InjectContextProvider>
        </IntlProvider>
      </ConfigProvider>
    </React.StrictMode>
  </>
}

export default App;
