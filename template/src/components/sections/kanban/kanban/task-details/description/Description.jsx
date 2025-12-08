import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import EditDescription from './EditDescription';

const Description = () => {
  const [isActiveEditMode, setIsActiveEditMode] = useState(false);
  const { watch } = useFormContext();

  const description = watch('description');

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Description
      </Typography>
      <Stack
        spacing={1}
        alignItems="flex-start"
        sx={[
          {
            px: 3,
            py: 2,
            height: 'auto',
            minHeight: 100,
            bgcolor: 'background.elevation2',
            borderRadius: 2,
          },
          isActiveEditMode && { px: 0, py: 0 },
        ]}
      >
        {!isActiveEditMode ? (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        ) : (
          <EditDescription handleCloseEditMode={() => setIsActiveEditMode(false)} />
        )}

        {!isActiveEditMode && (
          <IconButton onClick={() => setIsActiveEditMode(true)} sx={{ mr: -1, mt: -1 }}>
            <IconifyIcon
              icon="material-symbols:edit-outline"
              sx={{ color: 'text.primary', fontSize: 20 }}
            />
          </IconButton>
        )}
      </Stack>
    </Paper>
  );
};

export default Description;
