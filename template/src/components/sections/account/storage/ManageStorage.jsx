import { Grid, Typography } from '@mui/material';
import { convertSize } from 'lib/utils';
import StorageBar from './StorageBar';
import StorageCategoryCard from './StorageCategoryCard';

const ManageStorage = ({ storageData }) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {Math.round(
          (convertSize(storageData.totalSpaceUsedinKb) / convertSize(storageData.totalSpaceinKb)) *
            100,
        )}
        % Full
      </Typography>
      <StorageBar storage={storageData} />
      <Grid container spacing={1}>
        {storageData.categories.map((item) => (
          <Grid key={item.name} size={{ xs: 12, sm: 6, xl: 4 }}>
            <StorageCategoryCard storageCategory={item} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ManageStorage;
