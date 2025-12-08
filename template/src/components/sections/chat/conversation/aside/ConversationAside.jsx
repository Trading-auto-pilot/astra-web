import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Divider, Drawer, Paper, Stack, drawerClasses } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useChatContext } from 'providers/ChatProvider';
import paths from 'routes/paths';
import SimpleBar from 'components/base/SimpleBar';
import AsideHeader from './AsideHeader';
import ConfirmationDialog from './partials/ConfirmationDialog';
import FileAttachments from './partials/FileAttachments';
import MediaGallery from './partials/MediaGallery';
import RecipientsInfo from './partials/RecipientsInfo';

const ConversationAside = ({ isOpen, handleClose, drawerWidth }) => {
  const navigate = useNavigate();
  const { up } = useBreakpoints();
  const { topbarHeight } = useNavContext();
  const { chatDispatch, currentConversation } = useChatContext();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const upXl = up('xl');
  const upSm = up('sm');

  const handleConversationDelete = () => {
    if (!currentConversation?.id) return;
    chatDispatch({ type: 'DELETE_CONVERSATION' });
    setIsConfirmationOpen(false);
    navigate(paths.chat);
  };

  const handleConfirmation = {
    open: () => setIsConfirmationOpen(true),
    close: () => setIsConfirmationOpen(false),
    confirm: handleConversationDelete,
  };

  const drawerContent = (
    <Stack direction="column" height={1}>
      <AsideHeader handleClose={handleClose} />

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <SimpleBar>
          <Stack height={1} direction="column">
            <RecipientsInfo />
            <Divider flexItem />

            <MediaGallery />
            <Divider flexItem />

            <FileAttachments />

            <Paper background={1} sx={{ p: 3, mt: 'auto', textAlign: 'center' }}>
              <Button
                variant="text"
                color="error"
                sx={{ width: { xs: 1, sm: '50%', xl: 1 } }}
                onClick={() => setIsConfirmationOpen(true)}
              >
                Delete Conversation
              </Button>
            </Paper>
          </Stack>
        </SimpleBar>
      </Box>

      <ConfirmationDialog isOpen={isConfirmationOpen} handleConfirmation={handleConfirmation} />
    </Stack>
  );

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      anchor={upXl ? 'right' : 'top'}
      sx={({ vars }) => ({
        flexShrink: 0,
        height: 1,
        pointerEvents: 'none',
        width: { xs: 1, xl: drawerWidth },
        position: { xs: 'absolute', xl: 'unset' },
        overflow: 'hidden',
        zIndex: 10,
        [`& .${drawerClasses.paper}`]: {
          pointerEvents: 'auto',
          position: 'absolute',
          top: 0,
          border: 0,
          width: { xs: 1, xl: drawerWidth },
          height: ({ mixins }) =>
            mixins.contentHeight(topbarHeight, (upSm ? mixins.footer.sm : mixins.footer.xs) + 1),
          outline: `1px solid ${vars.palette.divider}`,
          bgcolor: vars.palette.background.elevation1,
        },
      })}
    >
      {drawerContent}
    </Drawer>
  );
};

export default ConversationAside;
