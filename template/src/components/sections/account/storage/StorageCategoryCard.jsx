import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { convertSize } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';

const StorageCategoryCard = ({ storageCategory }) => {
  const { icon, fileCount, name, spaceUsedinKb, color } = storageCategory;

  return (
    <Stack
      direction="column"
      sx={{
        p: 3,
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.elevation1',
        borderRadius: 2,
      }}
    >
      {icon && <IconifyIcon icon={icon} sx={{ mb: 2, fontSize: 40, color: color }} />}
      <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 700, textAlign: 'center' }}>
        {name}
      </Typography>
      <Stack spacing={1} sx={{ mb: 2 }} divider={<Divider orientation="vertical" flexItem />}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fileCount} Files
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          {convertSize(spaceUsedinKb)} GB
        </Typography>
      </Stack>

      <Button fullWidth>View</Button>
    </Stack>
  );
};

export default StorageCategoryCard;
