import { useLocation } from 'react-router';
import { Drawer, drawerClasses } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useChatContext } from 'providers/ChatProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import paths from 'routes/paths';

const ResponsiveSidebar = ({ children }) => {
  const location = useLocation();
  const { isChatSidebarOpen } = useChatContext();
  const {
    config: { topnavType },
  } = useSettingsContext();
  const { topbarHeight } = useNavContext();

  const drawerVariant = location.pathname === paths.chat ? 'permanent' : 'persistent';

  return (
    <Drawer
      variant={drawerVariant}
      open={drawerVariant === 'permanent' ? true : isChatSidebarOpen}
      anchor="left"
      sx={(theme) => ({
        [`& .${drawerClasses.paper}`]: {
          position: 'absolute',
          width: 1,
          border: 0,
          outline: `1px solid ${theme.vars.palette.divider}`,
          height: ({ mixins }) => mixins.contentHeight(topbarHeight, mixins.footer.sm),
          top: ({ mixins }) => mixins.topbar[topnavType],
        },
      })}
    >
      {children}
    </Drawer>
  );
};

export default ResponsiveSidebar;
