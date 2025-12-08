import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  dialogClasses,
} from '@mui/material';
import { recipientLists } from 'data/invoice';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const RecipientsFormDialogue = (props) => {
  const {
    title,
    subtitle,
    mode,
    open,
    handleDialogClose,
    onSubmit,
    handleDiscard,
    handleRemove,
    sx,
  } = props;

  const [selectedCustomer, setSelectedCustomer] = useState(recipientLists[0]);
  const handleSearch = () => {
    console.log('hello');
  };
  const handleSubmit = () => {
    onSubmit(selectedCustomer);
    handleDialogClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth={false}
      component="form"
      sx={{
        [`& .${dialogClasses.paper}`]: {
          borderRadius: 6,
          overflow: 'visible',
          ...sx,
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
        {title}
        <IconButton onClick={handleDialogClose}>
          <IconifyIcon icon="material-symbols:close" sx={{ fontSize: 20, color: 'neutral.dark' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3, position: 'relative' }}>
        {subtitle && (
          <DialogContentText
            variant="body2"
            sx={{ color: 'text.secondary', mb: 2, textWrap: 'pretty' }}
          >
            {subtitle}
          </DialogContentText>
        )}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 2,
            pb: 1,
            bgcolor: 'background.menu',
          }}
        >
          <StyledTextField
            id="search-box"
            type="search"
            fullWidth
            placeholder={`Search ${mode}`}
            onChange={handleSearch}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon
                      icon="material-symbols:search-rounded"
                      sx={{
                        fontSize: 20,
                        color: 'text.secondary',
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <RadioGroup>
          <List dense sx={{ maxHeight: 400, pt: 0 }}>
            {recipientLists.map((recipient) => (
              <ListItem
                key={recipient.id}
                sx={{
                  cursor: 'pointer',
                  p: { xs: 2, sm: 3 },
                  bgcolor:
                    recipient.id === selectedCustomer?.id
                      ? 'background.elevation2'
                      : 'background.elevation1',
                  borderRadius: 2,
                  mb: 1,
                  gap: { xs: 0.5, sm: 2 },
                  alignItems: 'flex-start',
                  '&:last-of-type': {
                    mb: 0,
                  },
                }}
                onClick={() => setSelectedCustomer(recipient)}
              >
                <Stack sx={{ flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                  <Avatar variant="circular" src={recipient.avatar} alt={recipient.name} />
                  <Box sx={{ maxWidth: 284 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, textTransform: 'capitalize', fontWeight: 700 }}
                    >
                      {recipient.name}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, color: 'text.secondary', fontWeight: 400 }}
                    >
                      {recipient.email}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, color: 'text.secondary', fontWeight: 400 }}
                    >
                      {recipient.phone}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {recipient.location}
                    </Typography>
                  </Box>
                </Stack>
                <FormControlLabel
                  label=""
                  value={recipient.id}
                  control={
                    <Radio checked={recipient.id === selectedCustomer?.id} sx={{ padding: 0 }} />
                  }
                  sx={{ m: 0, ml: 'auto' }}
                />
              </ListItem>
            ))}
          </List>
        </RadioGroup>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'flex-start', flexDirection: 'column' }}>
        {handleRemove && (
          <Button color="error" onClick={handleRemove}>
            Remove
          </Button>
        )}
        <Button
          variant="soft"
          color="neutral"
          sx={{ width: 1, mb: 3 }}
          startIcon={<IconifyIcon icon="material-symbols:add" />}
        >
          Create new customer
        </Button>
        <Stack sx={{ gap: 1, justifyContent: 'flex-end', width: 1 }}>
          <Button
            variant="soft"
            color="neutral"
            onClick={() => {
              if (handleDiscard) {
                handleDiscard();

                return;
              }
              handleDialogClose();
            }}
            sx={{ ml: 'auto !important' }}
          >
            Discard
          </Button>
          <Button type="button" variant="contained" color="primary" onClick={handleSubmit}>
            Confirm
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default RecipientsFormDialogue;
