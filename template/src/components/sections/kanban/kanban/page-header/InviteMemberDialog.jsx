import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
  dialogClasses,
  inputBaseClasses,
  selectClasses,
} from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledSelect from 'components/styled/StyledSelect';
import StyledTextField from 'components/styled/StyledTextField';

const InviteMemberDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        [`& .${dialogClasses.paper}`]: {
          width: 1,
          maxWidth: 492,
          borderRadius: 6,
        },
      }}
    >
      <DialogContent sx={{ p: 3, pb: { xs: 2, sm: 3 } }}>
        <Stack sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Invite members</Typography>
          <Button variant="text" color="neutral" size="small" shape="square" onClick={handleClose}>
            <IconifyIcon
              icon="material-symbols:close-rounded"
              sx={{ fontSize: 18, pointerEvents: 'none' }}
            />
          </Button>
        </Stack>
        <Stack gap={1} mb={2} direction={{ xs: 'column', sm: 'row' }}>
          <Autocomplete
            multiple
            id="users-autocomplete"
            options={users}
            getOptionLabel={(option) => option.name}
            popupIcon={null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            clearIcon={null}
            sx={{ width: 1 }}
            renderValue={(selectedOptions, getItemProps) =>
              selectedOptions.map((option, index) => (
                <Chip
                  label={option.name}
                  avatar={<Avatar src={option.avatar} />}
                  {...getItemProps({ index })}
                  key={option.id}
                />
              ))
            }
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;

              return (
                <Stack
                  gap={1}
                  key={key}
                  component="li"
                  sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                  {...optionProps}
                >
                  <Avatar src={option.avatar} sx={{ width: 24, height: 24 }} />
                  <Typography sx={{ lineClamp: 1 }}>{option.name}</Typography>
                </Stack>
              );
            }}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                autoFocus
                fullWidth
                placeholder="Add user"
                sx={{
                  [`& .${inputBaseClasses.root}`]: {
                    px: '8px !important',
                  },
                }}
              />
            )}
          />

          <StyledSelect
            variant="filled"
            defaultValue="Member"
            MenuProps={{
              slotProps: {
                list: {
                  dense: true,
                },
              },
            }}
            sx={{
              minWidth: 100,
              [`& .${selectClasses.icon}`]: { right: 8 },
            }}
          >
            <MenuItem value="Member">Member</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Guest">Guest</MenuItem>
          </StyledSelect>
        </Stack>
        <TextField fullWidth multiline rows={3} label="Write a short message (optional)" />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Button
          startIcon={<IconifyIcon icon="material-symbols:link-rounded" />}
          sx={{ flexShrink: 0 }}
        >
          Create & copy link
        </Button>
        <Box sx={{ ml: 'auto !important' }}>
          <Button color="neutral" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose} autoFocus>
            Invite
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default InviteMemberDialog;
