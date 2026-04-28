import React, { useState, useEffect } from "react";
import { Button, ConfigProvider, Tooltip, theme } from "antd";
import { IntlProvider } from 'react-intl';

import * as myTheme from '@/themes/light'
import { darkTheme } from '@/themes/dark'

import "./App.css";
import { ReactRoutes } from "./routers";
import { BrowserRouter } from "react-router-dom";
import zh from '@/locales/zh'
import { InjectContextProvider } from "./components/InjectContextProvider";
import { AmbientBackground } from '@/components/ambient_background';

type ThemeMode = 'light' | 'dark';
type ThemePreference = 'system' | ThemeMode;

const THEME_PREFERENCE_STORAGE_KEY = 'object-cloud-theme-preference';

const themePreferences: ThemePreference[] = ['system', 'light', 'dark'];

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredThemePreference = (): ThemePreference => {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const value = window.localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY);
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
};

const resolveThemeMode = (preference: ThemePreference, systemTheme: ThemeMode): ThemeMode =>
  preference === 'system' ? systemTheme : preference;

const ThemePreferenceIcon = ({ mode }: { mode: ThemePreference }) => {
  if (mode === 'light') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" />
      </svg>
    );
  }

  if (mode === 'dark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.4 15.3A8.2 8.2 0 0 1 8.7 3.6 8.8 8.8 0 1 0 20.4 15.3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  );
};

const App: React.FC = () => {
  const [systemThemeMode, setSystemThemeMode] = useState<ThemeMode>(getPreferredTheme)
  const [themePreference, setThemePreference] = useState<ThemePreference>(getStoredThemePreference)

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (event: MediaQueryListEvent) => {
      setSystemThemeMode(event.matches ? 'dark' : 'light')
    };

    setSystemThemeMode(matchMedia.matches ? 'dark' : 'light')

    // 监听主题变更
    if (typeof matchMedia.addEventListener === 'function') {
      matchMedia.addEventListener('change', handleThemeChange);
      return () => matchMedia.removeEventListener('change', handleThemeChange);
    }

    matchMedia.onchange = handleThemeChange;
    return () => {
      matchMedia.onchange = null;
    };
  }, [])

  const themeMode = resolveThemeMode(themePreference, systemThemeMode);
  const isDark = themeMode === 'dark';

  useEffect(() => {
    window.localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, themePreference);
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.dataset.themePreference = themePreference;
    document.body.dataset.theme = themeMode;
    document.body.dataset.themePreference = themePreference;
  }, [themeMode, themePreference]);

  const switchThemePreference = () => {
    setThemePreference((current) => {
      const currentIndex = themePreferences.indexOf(current);
      return themePreferences[(currentIndex + 1) % themePreferences.length];
    });
  };

  const themePreferenceLabel = {
    system: `跟随系统（当前${systemThemeMode === 'dark' ? '深色' : '浅色'}）`,
    light: '浅色模式',
    dark: '深色模式',
  }[themePreference];

  return <div className="app-root" data-theme={isDark ? 'dark' : 'light'}>
    <AmbientBackground themeMode={isDark ? 'dark' : 'light'} />
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDark ? darkTheme : myTheme.lightTheme,
      }}
      componentSize={'large'}
    >
      <Tooltip title={`主题：${themePreferenceLabel}`}>
        <Button
          className="theme-switch-button"
          shape="circle"
          icon={<ThemePreferenceIcon mode={themePreference} />}
          onClick={switchThemePreference}
        />
      </Tooltip>
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
