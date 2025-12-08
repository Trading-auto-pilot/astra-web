import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  dialogClasses,
} from '@mui/material';
import FileDropZone from 'components/base/FileDropZone';
import IconifyIcon from 'components/base/IconifyIcon';

const UploadFiles = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const handleDiscard = () => handleDialogClose();

  return (
    <>
      <Button
        variant="text"
        color="neutral"
        sx={{ p: 1, flexShrink: 0, ml: 'auto' }}
        startIcon={
          <IconifyIcon icon="material-symbols:upload-rounded" sx={{ height: 20, width: 20 }} />
        }
        onClick={handleDialogOpen}
      >
        Upload
      </Button>

      <Dialog
        id="upload-files-dialog"
        scroll="paper"
        open={isDialogOpen}
        onClose={handleDialogClose}
        sx={{
          [`& .${dialogClasses.paper}`]: {
            maxWidth: 500,
            width: 1,
            bgcolor: 'background.default',
          },
        }}
      >
        <DialogTitle
          component="h6"
          sx={{
            pt: 3,
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Upload files
          <IconButton onClick={handleDialogClose}>
            <IconifyIcon
              icon="material-symbols:close-rounded"
              sx={{ fontSize: 20, color: 'neutral.dark' }}
            />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 0 }}>
          <DialogContentText sx={{ mb: 3 }}>
            Securely upload, manage, and organize your files with ease.
          </DialogContentText>

          <FileDropZone
            multiple
            sx={{
              height: 140,
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button variant="soft" color="neutral" sx={{ px: 3 }} onClick={handleDiscard}>
            Discard
          </Button>
          <Button variant="contained" color="primary" sx={{ px: 3 }} onClick={handleDialogClose}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadFiles;
