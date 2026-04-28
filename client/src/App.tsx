import React, { useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { IntlProvider } from 'react-intl';

import * as myTheme from '@/themes/light'
import { darkTheme } from '@/themes/dark'

import "./App.css";
import { ReactRoutes } from "./routers";
import { BrowserRouter } from "react-router-dom";
import zh from '@/locales/zh'
import { InjectContextProvider } from "./components/InjectContextProvider";
import { AmbientBackground } from '@/components/ambient_background';

const App: React.FC = () => {
  const [osThemeModal, setOsThemeModal] = useState<'light' | 'dark'>()

  useEffect(() => {
    let matchMedia = window.matchMedia('(prefers-color-scheme:dark)')
    // 监听主题变更
    matchMedia.onchange = function (e) {
      console.log('prefers-color-scheme', e);
      setOsThemeModal(e.matches ? 'dark' : 'light')
    }

    setOsThemeModal(matchMedia.matches ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    const currentTheme = osThemeModal || 'light';
    document.documentElement.dataset.theme = currentTheme;
    document.body.dataset.theme = currentTheme;
  }, [osThemeModal]);

  const isDark = osThemeModal === 'dark';

  return <div className="app-root" data-theme={isDark ? 'dark' : 'light'}>
    <AmbientBackground themeMode={isDark ? 'dark' : 'light'} />
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDark ? darkTheme : myTheme.lightTheme,
      }}
      componentSize={'large'}
    >
      <IntlProvider locale={'zh'} messages={zh}>
        <InjectContextProvider>
          <BrowserRouter>
            <ReactRoutes />
          </BrowserRouter>
        </InjectContextProvider>
      </IntlProvider>
    </ConfigProvider>
  </div>
}

export default App;
