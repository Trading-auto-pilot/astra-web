import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Badge,
  Button,
  List,
  ListItemButton,
  Menu,
  Stack,
  Tooltip,
  Typography,
  badgeClasses,
  inputBaseClasses,
  listClasses,
  paperClasses,
} from '@mui/material';
import { useChatContext } from 'providers/ChatProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';
import RecipientAvatar from 'components/sections/chat/common/RecipientAvatar';
import StyledTextField from 'components/styled/StyledTextField';
import FilterMenu from './FilterMenu';

const getDisplayName = (conversation) =>
  conversation.conversationName || conversation.recipients.map((p) => p.name).join(', ');

const SearchFilterMenu = ({ handleSearch, handleFilter }) => {
  const { conversations, searchQuery } = useChatContext();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchFilterAnchorEl, setSearchFilterAnchorEl] = useState(null);

  const handleSearchMenu = {
    set: (event) => setSearchFilterAnchorEl(event.currentTarget),
    close: () => setSearchFilterAnchorEl(null),
  };

  useEffect(() => {
    if (searchFilterAnchorEl) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [searchFilterAnchorEl]);

  return (
    <>
      <Tooltip title="Search & filter" placement="right">
        <Badge
          badgeContent={`${conversations.length}`}
          color="primary"
          sx={{
            [`& .${badgeClasses.badge}`]: {
              top: 6,
              right: 2,
            },
          }}
        >
          <Button variant="soft" shape="circle" color="neutral" onClick={handleSearchMenu.set}>
            <IconifyIcon icon="material-symbols:filter-alt-outline" sx={{ fontSize: 18 }} />
          </Button>
        </Badge>
      </Tooltip>
      <Menu
        anchorEl={searchFilterAnchorEl}
        open={!!searchFilterAnchorEl}
        onClose={handleSearchMenu.close}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{
          ml: 1,
          [`& .${listClasses.root}`]: { py: 0 },
          [`& .${paperClasses.root}`]: { maxWidth: 264, width: 1 },
        }}
      >
        <Stack gap={1} sx={{ position: 'sticky', top: 0, zIndex: 1, p: 2 }}>
          <StyledTextField
            inputRef={inputRef}
            autoFocus
            fullWidth
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ [`& .${inputBaseClasses.root}`]: { bgcolor: 'action.hover' } }}
          />

          <FilterMenu handleFilter={handleFilter} />
        </Stack>

        <SimpleBar sx={{ height: 'calc(300px - 80px)' }}>
          <List dense>
            {conversations.map((conversation) => (
              <ListItemButton
                key={conversation.id}
                onClick={() => {
                  navigate(paths.chatConversation(String(conversation.id)));
                  handleSearchMenu.close();
                }}
                sx={{ borderRadius: 0 }}
              >
                <Stack direction="row" alignItems="center" gap={2} sx={{ width: '100%' }}>
                  <RecipientAvatar
                    recipients={conversation.recipients}
                    avatarStyles={{ width: 32, height: 32 }}
                    badgeStyles={{ width: 10, height: 10, border: 2 }}
                  />
                  <Tooltip
                    title={
                      !conversation.conversationName &&
                      conversation.recipients.length > 1 &&
                      getDisplayName(conversation)
                    }
                    placement="top"
                  >
                    <Typography variant="subtitle2" sx={{ lineClamp: 1 }}>
                      {getDisplayName(conversation)}
                    </Typography>
                  </Tooltip>
                </Stack>
              </ListItemButton>
            ))}
          </List>
        </SimpleBar>
      </Menu>
    </>
  );
};

export default SearchFilterMenu;
