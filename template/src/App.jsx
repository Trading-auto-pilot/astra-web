import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useConfigFromQuery } from 'hooks/useConfigFromQuery';
import { useThemeMode } from 'hooks/useThemeMode';
import AuthProvider from 'providers/AuthProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import { REFRESH } from 'reducers/SettingsReducer';
import SettingPanelToggler from 'components/settings-panel/SettingPanelToggler';
import SettingsPanel from 'components/settings-panel/SettingsPanel';

const App = () => {
  const { pathname } = useLocation();
  const { mode } = useThemeMode();
  const { configDispatch } = useSettingsContext();

  useConfigFromQuery();

  const isShowcase = pathname.startsWith('/showcase') || pathname === '/';

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overscrollBehavior = isShowcase ? 'none' : '';

    return () => {
      document.body.style.overscrollBehavior = '';
    };
  }, [pathname, isShowcase]);

  useLayoutEffect(() => {
    configDispatch({ type: REFRESH });
  }, [mode]);

  return (
    <AuthProvider>
      <Outlet />

      {!isShowcase && (
        <>
          <SettingsPanel />
          <SettingPanelToggler />
        </>
      )}
    </AuthProvider>
  );
};

export default App;
