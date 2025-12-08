import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Button, Stack } from '@mui/material';
import { useEmailContext } from 'providers/EmailProvider';
import { REFRESH_EMAILS, SEARCH_EMAIL } from 'reducers/EmailReducer';
import IconifyIcon from 'components/base/IconifyIcon';
import EmailComposeDialog from 'components/sections/email/common/EmailComposeDialog';
import EmailFilterDialog from 'components/sections/email/common/EmailFilterDialog';
import StyledTextField from 'components/styled/StyledTextField';

const EmailHeader = ({ toggleDrawer }) => {
  const [searchText, setSearchText] = useState('');
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [openComposeDialog, setOpenComposeDialog] = useState(false);
  const { emailDispatch, resizableWidth } = useEmailContext();
  const { label, id } = useParams();

  const toggleFilterDialog = () => {
    setOpenFilterDialog((prev) => !prev);
  };

  const toggleComposeDialog = () => {
    setOpenComposeDialog(!openComposeDialog);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    emailDispatch({
      type: SEARCH_EMAIL,
      payload: { query: e.target.value, folder: label },
    });
  };

  const handleRefresh = () => {
    setSearchText('');
    emailDispatch({ type: REFRESH_EMAILS, payload: label });
  };

  useEffect(() => {
    setSearchText('');
    emailDispatch({ type: SEARCH_EMAIL, payload: { query: '', folder: label } });
  }, [label]);

  const isInvalidOrLargeWidth = !id || resizableWidth > 500;

  return (
    <Box sx={{ mb: '2px' }}>
      <Stack
        spacing={1}
        sx={[
          { px: 3, flexWrap: 'wrap' },
          isInvalidOrLargeWidth && { px: { sm: 5 }, flexWrap: { sm: 'nowrap' } },
        ]}
      >
        <Button color="neutral" variant="soft" shape="square" onClick={toggleDrawer}>
          <IconifyIcon icon="material-symbols:filter-list-rounded" fontSize={20} />
        </Button>
        <Button
          variant="contained"
          onClick={toggleComposeDialog}
          sx={[{ flex: 1 }, (!id || resizableWidth > 500) && { flex: { sm: 'unset' } }]}
          startIcon={<IconifyIcon icon="material-symbols:add-2-rounded" sx={{ fontSize: 20 }} />}
        >
          Compose
        </Button>
        <StyledTextField
          id="search-box"
          type="search"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search email"
          sx={[
            { order: 1, width: 1 },
            isInvalidOrLargeWidth && {
              order: { sm: 0 },
              width: { sm: 'auto' },
              flex: { sm: 1 },
            },
          ]}
        />
        <Box
          sx={[
            { mr: { xs: '-8px' }, ml: 'auto' },
            isInvalidOrLargeWidth && { mr: { sm: '-10px' } },
          ]}
        >
          <Button shape="square" color="neutral" onClick={toggleFilterDialog}>
            <IconifyIcon icon="material-symbols:filter-alt-outline" fontSize={20} />
          </Button>
          <Button color="neutral" shape="square" onClick={handleRefresh}>
            <IconifyIcon icon="material-symbols:refresh-rounded" fontSize={20} />
          </Button>
        </Box>
      </Stack>
      <EmailFilterDialog open={openFilterDialog} handleClose={toggleFilterDialog} />
      <EmailComposeDialog open={openComposeDialog} handleClose={toggleComposeDialog} />
    </Box>
  );
};

export default EmailHeader;
