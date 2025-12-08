import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  listItemButtonClasses,
} from '@mui/material';
import { getFileIcon } from 'lib/utils';
import { useChatContext } from 'providers/ChatProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const FileAttachments = () => {
  const [attachmentsCount, setAttachmentsCount] = useState(4);
  const { currentConversation } = useChatContext();

  const fileAttachments =
    currentConversation?.messages.flatMap(
      (conversation) => conversation.attachments?.files?.map((file) => ({ ...file })) || [],
    ) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: fileAttachments.length > 0 ? 4 : 2, px: { md: 2 } }}
      >
        <Typography variant="h6">Files</Typography>
        <Button
          variant="text"
          disabled={!fileAttachments.length}
          onClick={() => setAttachmentsCount(fileAttachments.length)}
        >
          View all
        </Button>
      </Stack>

      {fileAttachments.length > 0 ? (
        <List disablePadding>
          {fileAttachments.slice(0, attachmentsCount).map((file, index) => (
            <ListItem
              key={index}
              disablePadding
              secondaryAction={
                <Stack gap={0.5}>
                  <Tooltip title="Download">
                    <Button variant="text" color="neutral" shape="square" size="small">
                      <IconifyIcon icon="material-symbols:download-rounded" fontSize={18} />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <Button variant="text" color="neutral" shape="square" size="small">
                      <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={18} />
                    </Button>
                  </Tooltip>
                </Stack>
              }
              sx={{
                [`& .${listItemButtonClasses.root}`]: {
                  pr: 11,
                },
              }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    sx={{ width: 40, height: 40, bgcolor: 'primary.lighter', borderRadius: 2 }}
                  >
                    <IconifyIcon
                      icon={getFileIcon(file.format)}
                      sx={{ fontSize: 24, color: 'text.primary' }}
                    />
                  </Avatar>
                </ListItemAvatar>

                <Tooltip title={file.name}>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          lineClamp: 1,
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                        }}
                      >
                        {file.name}
                      </Typography>
                    }
                  />
                </Tooltip>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="subtitle2" color="text.disabled" px={{ md: 2 }}>
          No files attached yet.
        </Typography>
      )}
    </Box>
  );
};

export default FileAttachments;
