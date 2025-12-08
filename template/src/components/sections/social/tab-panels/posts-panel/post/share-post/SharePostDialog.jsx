import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  ToggleButton,
  dialogClasses,
  formControlLabelClasses,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import IconifyIcon from 'components/base/IconifyIcon';
import SharePrivacy from './SharePrivacy';
import ShareRecipientSelector from './ShareRecipientSelector';

const SharePostDialog = ({ shares }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedShareOption, setSelectedShareOption] = useState('feed');

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleChange = (event) => {
    setSelectedShareOption(event.target.value);
  };

  const handleShare = () => {
    enqueueSnackbar('This post was shared successfully.', { variant: 'success' });
    setIsDialogOpen(false);
  };

  return (
    <>
      <ToggleButton value="share" size="small" disableRipple onClick={() => setIsDialogOpen(true)}>
        <IconifyIcon icon="material-symbols:share-outline" sx={{ fontSize: 18 }} />{' '}
        <Box component="span">{shares}</Box>
      </ToggleButton>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        sx={{
          [`& .${dialogClasses.paper}`]: {
            borderRadius: 6,
            width: 1,
            maxWidth: 375,
          },
        }}
      >
        <DialogTitle
          component="h6"
          sx={{
            pt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Share this post
          <IconButton onClick={handleDialogClose}>
            <IconifyIcon
              icon="material-symbols:close"
              sx={{ fontSize: 20, color: 'neutral.dark' }}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pb: 2 }}>
          <FormControl sx={{ mb: 3 }}>
            <RadioGroup
              name="share-radio-buttons-group"
              value={selectedShareOption}
              onChange={handleChange}
            >
              <FormControlLabel
                sx={{ [`& .${formControlLabelClasses.label}`]: { fontWeight: 500 }, mb: 1 }}
                value="feed"
                control={<Radio />}
                label="To your feed"
              />
              <FormControlLabel
                sx={{ [`& .${formControlLabelClasses.label}`]: { fontWeight: 500 }, mb: 1 }}
                value="email"
                control={<Radio />}
                label="Via email"
              />
              <FormControlLabel
                sx={{ [`& .${formControlLabelClasses.label}`]: { fontWeight: 500 }, mb: 1 }}
                value="message"
                control={<Radio />}
                label="Via message"
              />
            </RadioGroup>
          </FormControl>

          {selectedShareOption === 'feed' ? (
            <SharePrivacy />
          ) : selectedShareOption === 'email' ? (
            <ShareRecipientSelector shareOption={selectedShareOption} />
          ) : (
            <ShareRecipientSelector shareOption={selectedShareOption} />
          )}

          <TextField
            fullWidth
            label="Add a message (optional)"
            multiline
            rows={2}
            variant="filled"
          />
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 0,
          }}
        >
          <Button variant="soft" color="neutral" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleShare}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SharePostDialog;
