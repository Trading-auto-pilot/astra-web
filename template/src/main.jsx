import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BreakpointsProvider from 'providers/BreakpointsProvider';
import NotistackProvider from 'providers/NotistackProvider';
import SettingsPanelProvider from 'providers/SettingsPanelProvider';
import SettingsProvider from 'providers/SettingsProvider';
import ThemeProvider from 'providers/ThemeProvider';
import router from 'routes/router';
import SWRConfiguration from 'services/configuration/SWRConfiguration';
import './locales/i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SWRConfiguration>
      <SettingsProvider>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <NotistackProvider>
              <BreakpointsProvider>
                <SettingsPanelProvider>
                  <RouterProvider router={router} />
                </SettingsPanelProvider>
              </BreakpointsProvider>
            </NotistackProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SWRConfiguration>
  </React.StrictMode>,
);
