import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Button, Stack } from '@mui/material';
import clsx from 'clsx';
import sitemap from 'routes/sitemap';
import IconifyIcon from 'components/base/IconifyIcon';
import { useNavContext } from '../NavProvider';
import NavitemPopover from './NavItemPopover';

const TopnavItems = ({ type = 'default' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { pathname } = useLocation();
  const { isNestedItemOpen } = useNavContext();

  useEffect(() => {
    setAnchorEl(null);
    setSelectedMenu(null);
  }, [pathname]);

  return (
    <Stack
      sx={{
        alignItems: 'center',
        gap: '2px',
      }}
      className="nav-items"
    >
      {sitemap.map((menu) => (
        <Button
          key={menu.id}
          variant="text"
          className={clsx({
            active: isNestedItemOpen(menu.items),
          })}
          color={isNestedItemOpen(menu.items) ? 'primary' : 'neutral'}
          size={type === 'slim' ? 'small' : 'large'}
          endIcon={<IconifyIcon icon="material-symbols:expand-more-rounded" />}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
            setSelectedMenu(menu);
          }}
          sx={{ px: 2, fontSize: 14 }}
        >
          {menu.subheader}
        </Button>
      ))}
      {selectedMenu && (
        <NavitemPopover
          handleClose={() => {
            setAnchorEl(null);
            setSelectedMenu(null);
          }}
          anchorEl={anchorEl}
          open={!!anchorEl && !!selectedMenu}
          items={selectedMenu.items}
          level={0}
        />
      )}
    </Stack>
  );
};

export default TopnavItems;
