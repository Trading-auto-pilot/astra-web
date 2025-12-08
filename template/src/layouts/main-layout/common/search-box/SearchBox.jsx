import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import SearchDialog from './SearchDialog';
import SearchPopover from './SearchPopover';
import SearchTextField from './SearchTextField';

const SearchBox = ({ sx }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <SearchTextField
        sx={sx}
        focused={false}
        disabled={Boolean(anchorEl)}
        slotProps={{
          input: {
            onClick: handleClick,
            sx: {
              borderRadius: 5,
              border: 1,
              borderStyle: 'solid',
              borderColor: 'transparent',
            },
          },
        }}
      />
      <SearchPopover anchorEl={anchorEl} handleClose={handleClose} />
    </>
  );
};

export const SearchBoxButton = ({ type = 'default', sx, ...rest }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { up } = useBreakpoints();
  const upSm = up('sm');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {type === 'slim' && upSm ? (
        <Button
          className="search-box-button"
          color="neutral"
          size="small"
          variant="soft"
          onClick={handleClick}
          startIcon={<IconifyIcon icon="material-symbols:search-rounded" sx={{ fontSize: 20 }} />}
          sx={{ borderRadius: 11, py: '5px', ...sx }}
          {...rest}
        >
          <Box sx={{ mb: 0.25 }} component="span">
            Search
          </Box>
        </Button>
      ) : (
        <Button
          className="search-box-button"
          color="neutral"
          shape="circle"
          variant="soft"
          size={type === 'slim' ? 'small' : 'medium'}
          onClick={handleClick}
          sx={sx}
          {...rest}
        >
          <IconifyIcon
            icon="material-symbols:search-rounded"
            sx={[{ fontSize: 20 }, type === 'slim' && { fontSize: 18 }]}
          />
        </Button>
      )}
      <SearchDialog anchorEl={anchorEl} handleClose={handleClose} />
    </>
  );
};

export default SearchBox;
