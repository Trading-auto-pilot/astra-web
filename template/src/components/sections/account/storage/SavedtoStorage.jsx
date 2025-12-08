import { Button, FormControlLabel, Grid, Stack, Switch, Typography } from '@mui/material';
import { convertSize, cssVarRgba } from 'lib/utils';

const SavedtoStorage = ({ backupSyncSettings, storageData }) => {
  const { totalSpaceUsedinKb, totalSpaceinKb } = storageData;

  return (
    <>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
        Backup & Sync Settings
      </Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {backupSyncSettings.map((item) => (
          <Grid key={item.name} size={{ xs: 6, md: 4 }}>
            <FormControlLabel
              control={<Switch defaultChecked={item.enabled} />}
              label={item.name}
              sx={{ gap: 2, ml: 0 }}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
        Enhanced Data Security
      </Typography>
      <FormControlLabel
        control={<Switch defaultChecked />}
        label="Advanced data protection"
        sx={{ gap: 2, ml: 0, mb: 3 }}
      />

      <Typography variant="subtitle2" sx={{ mb: 0.75, fontWeight: 700 }}>
        Manage Storage
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        <Typography
          variant="body2"
          component="span"
          sx={{ color: 'warning.main', fontWeight: 600 }}
        >
          Your storage is {Math.round((totalSpaceUsedinKb / totalSpaceinKb) * 100)}% full.
        </Typography>{' '}
        To continue uploading files, saving photos and sending or receiving emails, make sure you
        have enough available space.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 0 }}
        sx={(theme) => ({
          px: 2,
          py: 2,
          alignItems: 'center',
          bgcolor: cssVarRgba(theme.vars.palette.warning.mainChannel, 0.08),
          borderRadius: 2,
        })}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Cloud Storage
        </Typography>
        <Typography variant="subtitle2" sx={{ ml: { xs: 0, sm: 3 }, color: 'text.secondary' }}>
          {convertSize(totalSpaceinKb)} GB{' '}
          <Typography variant="subtitle2" component="span" sx={{ color: 'warning.main' }}>
            (
            {Math.round(convertSize(totalSpaceinKb - totalSpaceUsedinKb, { from: 'kb', to: 'mb' }))}{' '}
            MB available)
          </Typography>{' '}
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="warning"
          sx={{ ml: { xs: 0, sm: 'auto' }, borderRadius: 1 }}
        >
          Upgrade storage
        </Button>
      </Stack>
    </>
  );
};

export default SavedtoStorage;
