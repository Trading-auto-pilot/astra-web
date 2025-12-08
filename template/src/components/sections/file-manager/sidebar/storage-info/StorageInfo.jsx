import { Stack, Typography } from '@mui/material';
import { fileStorageData } from 'data/file-manager';
import StorageBar from './StorageBar';
import StorageCTA from './StorageCTA';
import StorageSegmentList from './StorageSegmentList';

const StorageInfo = () => {
  return (
    <Stack direction="column" gap={2} sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        Your Storage
      </Typography>

      <StorageBar data={fileStorageData} />

      <StorageSegmentList data={fileStorageData} />

      <StorageCTA />
    </Stack>
  );
};

export default StorageInfo;
