import { useState } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  dialogClasses,
} from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';

const filterConfigs = [
  {
    id: 'type',
    label: 'Type',
    options: [
      {
        label: 'Documents',
        value: 'documents',
      },
      {
        label: 'Images',
        value: 'images',
      },
      {
        label: 'Videos',
        value: 'videos',
      },
    ],
  },
  {
    id: 'people',
    label: 'People',
    options: users.map(({ name, avatar }) => ({
      label: (
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar src={avatar} sx={{ height: 20, width: 20 }} />
          <span>{name}</span>
        </Stack>
      ),
      value: name,
    })),
  },
  {
    id: 'modified',
    label: 'Modified',
    options: [
      { label: 'Last 7 days', value: '7days' },
      { label: 'Last 30 days', value: '30days' },
      { label: 'Last year', value: '1year' },
    ],
  },
  {
    id: 'location',
    label: 'Location',
    options: [
      {
        label: 'Shared with me',
        value: 'shared',
      },
      {
        label: 'My drive',
        value: 'drive',
      },
      {
        label: 'Starred',
        value: 'starred',
      },
    ],
  },
];

const FilterFiles = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const handleFilterChange = (filterId) => (event) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: event.target.value,
    }));
  };

  const handleReset = () => {
    setFilterValues({});
  };

  return (
    <>
      <Button variant="soft" shape="square" color="neutral" onClick={handleDialogOpen}>
        <IconifyIcon icon="material-symbols:filter-alt-outline" fontSize={24} />
      </Button>

      <Dialog
        id="filter-files-dialog"
        open={isDialogOpen}
        onClose={handleDialogClose}
        sx={{
          [`& .${dialogClasses.paper}`]: {
            maxWidth: 360,
            width: 1,
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
          Filter
          <IconButton onClick={handleDialogClose}>
            <IconifyIcon
              icon="material-symbols:close-rounded"
              sx={{ fontSize: 20, color: 'neutral.dark' }}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Filter files by type, people, modified, or location.
          </DialogContentText>

          <Stack direction="column" gap={1}>
            {filterConfigs.map((filter) => (
              <FormControl key={filter.id} fullWidth>
                <InputLabel id={`${filter.id}-select-label`}>{filter.label}</InputLabel>
                <Select
                  labelId={`${filter.id}-select-label`}
                  id={`${filter.id}-select`}
                  value={filterValues[filter.id] || ''}
                  label={filter.label}
                  onChange={handleFilterChange(filter.id)}
                  MenuProps={{
                    sx: {
                      maxHeight: 336,
                    },
                  }}
                >
                  {filter.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button variant="soft" color="neutral" sx={{ px: 3 }} onClick={handleReset}>
            Reset
          </Button>
          <Button variant="contained" color="primary" sx={{ px: 3 }} onClick={handleDialogClose}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FilterFiles;
