import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  inputBaseClasses,
} from '@mui/material';
import { useChatContext } from 'providers/ChatProvider';
import { UPDATE_CONVERSATION_NAME } from 'reducers/ChatReducer';
import IconifyIcon from 'components/base/IconifyIcon';
import RecipientAvatar from 'components/sections/chat/common/RecipientAvatar';
import StyledTextField from 'components/styled/StyledTextField';

const RecipientsInfo = () => {
  const { currentConversation, chatDispatch } = useChatContext();
  const inputRef = useRef(null);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const fallbackName = currentConversation?.recipients.map(({ name }) => name).join(', ');

  const [editedName, setEditedName] = useState(
    currentConversation?.conversationName || fallbackName,
  );

  const handleCopyEmail = async (email) => {
    setIsEmailCopied(true);
    await navigator.clipboard.writeText(email);
    setTimeout(() => setIsEmailCopied(false), 2000);
  };

  const handleEditClick = () => {
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (currentConversation) {
      const newName = editedName?.trim() || fallbackName || '';
      chatDispatch({
        type: UPDATE_CONVERSATION_NAME,
        payload: newName,
      });
      setEditedName(newName);
    }
    setIsEditingName(false);
  };

  useEffect(() => {
    setEditedName(currentConversation?.conversationName || fallbackName);
    setIsEditingName(false);
  }, [currentConversation?.id]);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditingName]);

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row', xl: 'column' }}
        rowGap={2}
        columnGap={{ xs: 2, lg: 4 }}
        alignItems="center"
      >
        {currentConversation ? (
          <RecipientAvatar
            recipients={currentConversation.recipients}
            avatarStyles={{ width: 118, height: 118 }}
            badgeStyles={{ width: 32, height: 32, border: 3 }}
          />
        ) : (
          <Skeleton variant="circular" width={118} height={118} />
        )}

        <Stack
          direction="column"
          width={1}
          gap={1}
          alignItems={{ xs: 'center', sm: 'flex-start', xl: 'center' }}
        >
          <Stack
            gap={1}
            width={1}
            alignItems="center"
            justifyContent={{ xs: 'center', sm: 'flex-start' }}
          >
            {isEditingName ? (
              <StyledTextField
                inputRef={inputRef}
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveName();
                  }
                }}
                size="small"
                autoFocus
                sx={{
                  [`& .${inputBaseClasses.root}`]: {
                    bgcolor: 'transparent',
                    '&:hover': { bgcolor: 'transparent' },
                    [`&.${inputBaseClasses.focused}`]: { outline: 'none', bgcolor: 'transparent' },
                    [`& .${inputBaseClasses.input}`]: {
                      pl: 0,
                      borderRadius: 0,
                      py: 1.125,
                      fontSize: 'h6.fontSize',
                      fontWeight: 'h6.fontWeight',
                    },
                  },
                }}
              />
            ) : editedName ? (
              <Tooltip title={fallbackName}>
                <Typography
                  variant="h6"
                  sx={{ lineClamp: 1, overflow: 'hidden', wordBreak: 'break-all' }}
                >
                  {editedName}
                </Typography>
              </Tooltip>
            ) : (
              <Skeleton variant="text" width={200} />
            )}

            {!isEditingName && editedName && (
              <Tooltip title="Edit name">
                <Button variant="text" shape="circle" color="neutral" onClick={handleEditClick}>
                  <IconifyIcon icon="material-symbols:edit-outline" fontSize={18} />
                </Button>
              </Tooltip>
            )}
          </Stack>

          <List dense disablePadding sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}>
            {currentConversation?.recipients?.map((recipient) => (
              <ListItem disablePadding key={recipient.id} disableGutters sx={{ gap: 1 }}>
                <ListItemIcon>
                  <IconifyIcon
                    icon="material-symbols:mail-outline-rounded"
                    fontSize={20}
                    color="text.secondary"
                  />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Stack gap={1} alignItems="center">
                      <Link
                        href={`mailto:${recipient.email}`}
                        variant="subtitle2"
                        sx={{ lineClamp: 1, overflow: 'hidden', wordBreak: 'break-all' }}
                      >
                        {recipient.email}
                      </Link>
                      <Tooltip title={isEmailCopied ? 'Copied!' : 'Copy'}>
                        <Button
                          onClick={() => handleCopyEmail(recipient.email)}
                          variant="text"
                          shape="circle"
                          color="neutral"
                        >
                          <IconifyIcon
                            icon="material-symbols:content-copy-outline-rounded"
                            fontSize={18}
                          />
                        </Button>
                      </Tooltip>
                    </Stack>
                  }
                  sx={{ m: 0 }}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RecipientsInfo;
