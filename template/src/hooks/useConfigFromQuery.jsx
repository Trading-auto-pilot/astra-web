import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useSettingsContext } from 'providers/SettingsProvider';
import { RESET } from 'reducers/SettingsReducer';
import { useThemeMode } from './useThemeMode';

const validators = {
  themeMode: ['light', 'dark', 'system'],
  textDirection: ['ltr', 'rtl'],
  navigationMenuType: ['sidenav', 'topnav', 'combo'],
  sidenavType: ['default', 'stacked', 'slim'],
  topnavType: ['default', 'stacked', 'slim'],
  navColor: ['default', 'vibrant'],
  locale: ['en-US', 'fr-FR', 'bn-BD', 'zh-CN', 'hi-IN', 'ar-SA'],
};

export const useConfigFromQuery = () => {
  const [searchParams] = useSearchParams();
  const { setThemeMode } = useThemeMode();
  const { setConfig, configDispatch } = useSettingsContext();

  useEffect(() => {
    const defaultConfigs = searchParams.get('defaultConfigs');

    if (
      (searchParams.size > 0 && Object.keys(validators).some((key) => searchParams.has(key))) ||
      defaultConfigs
    ) {
      configDispatch({ type: RESET });
    }

    const config = {};

    Object.keys(validators).forEach((key) => {
      const value = searchParams.get(key);
      if (value && validators[key].includes(value)) {
        config[key] = value;
      }
    });

    if (Object.keys(config).length) {
      if (config.themeMode) {
        setThemeMode(config.themeMode);
        delete config.themeMode;
      }

      setConfig(config);
    }
  }, [searchParams]);
};
