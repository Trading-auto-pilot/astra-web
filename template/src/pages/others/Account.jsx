import { useState } from 'react';
import { TabContext } from '@mui/lab';
import { Container, Drawer, Paper, Stack } from '@mui/material';
import { accountTabs } from 'data/account/account-tabs';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import AccountsProvider from 'providers/AccountsProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import SimpleBar from 'components/base/SimpleBar';
import SideTabList from 'components/sections/account/SideTabList';
import AccountTabPanel from 'components/sections/account/common/AccountTabPanel';

const Account = () => {
  const [activeTab, setActiveTab] = useState(accountTabs[0].value);
  const { down } = useBreakpoints();
  const [showTabList, setShowTabList] = useState(true);
  const {
    config: { textDirection },
  } = useSettingsContext();
  const { topbarHeight } = useNavContext();

  const downMd = down('md');
  const handleChange = (_event, newValue) => setActiveTab(newValue);

  return (
    <AccountsProvider>
      <TabContext value={activeTab}>
        <Stack>
          {downMd ? (
            <Drawer
              hideBackdrop
              anchor={textDirection === 'ltr' ? 'left' : 'right'}
              open={showTabList}
              onClose={() => setShowTabList(false)}
              ModalProps={{
                keepMounted: true,
                disablePortal: true,
              }}
              slotProps={{
                paper: {
                  sx: {
                    bgcolor: 'background.elevation1',
                    width: 1,
                    overflow: 'hidden',
                    pointerEvents: 'auto',
                    height: ({ mixins }) => mixins.contentHeight(topbarHeight),
                    top: ({ mixins }) => mixins.topOffset(topbarHeight, 1),
                  },
                },
              }}
              sx={{
                pointerEvents: 'none',
              }}
            >
              <SimpleBar>
                <SideTabList setShowTabList={setShowTabList} handleChange={handleChange} />
              </SimpleBar>
            </Drawer>
          ) : (
            <Paper
              background={1}
              sx={{
                width: { md: 324, lg: 405 },
                position: 'sticky',
                top: ({ mixins }) => mixins.topOffset(topbarHeight),
                height: ({ mixins }) => mixins.contentHeight(topbarHeight),
              }}
            >
              <SimpleBar>
                <SideTabList setShowTabList={setShowTabList} handleChange={handleChange} />
              </SimpleBar>
            </Paper>
          )}

          <Paper sx={{ flex: 1, maxWidth: 1 }}>
            <Container
              maxWidth={false}
              sx={{
                px: { xs: 3, md: 5 },
                py: 5,
                maxWidth: { xs: 628, md: 660 },
                overflowY: 'hidden',
                height: downMd ? 1 : 'auto',
              }}
            >
              {accountTabs.map((tab) => (
                <AccountTabPanel
                  key={tab.id}
                  label={tab.label}
                  value={tab.value}
                  title={tab.title}
                  panelIcon={tab.panelIcon}
                  setShowTabList={setShowTabList}
                >
                  {tab.tabPanel}
                </AccountTabPanel>
              ))}
            </Container>
          </Paper>
        </Stack>
      </TabContext>
    </AccountsProvider>
  );
};

export default Account;
