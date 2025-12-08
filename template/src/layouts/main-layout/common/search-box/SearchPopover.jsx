import { Fade, Popover } from '@mui/material';
import { useSettingsContext } from 'providers/SettingsProvider';
import SearchResult from './SearchResult';

const Transition = function Transition({ ref, ...props }) {
  return <Fade ref={ref} {...props} />;
};

const SearchPopover = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl);
  const {
    config: { navigationMenuType },
  } = useSettingsContext();

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      marginThreshold={0}
      elevation={3}
      transitionDuration={150}
      slots={{ transition: Transition }}
      slotProps={{
        paper: {
          sx: [
            {
              width: 1,
              maxWidth: { sm: 420 },
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              borderWidth: '0 !important',
              boxShadow: (theme) => `0 0 0 1px ${theme.vars.palette.menuDivider}`,
            },
            (navigationMenuType === 'topnav' || navigationMenuType === 'combo') && {
              maxWidth: { sm: 480 },
            },
          ],
        },
        root: {
          slotProps: {
            backdrop: {
              invisible: false,
            },
          },
        },
      }}
    >
      <SearchResult handleClose={handleClose} />
    </Popover>
  );
};

export default SearchPopover;
