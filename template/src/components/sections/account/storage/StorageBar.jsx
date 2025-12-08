import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { convertSize } from 'lib/utils';

const StorageBar = ({ storage }) => {
  const { categories, totalSpaceinKb, totalSpaceUsedinKb } = storage;

  return (
    <>
      <Stack
        spacing={0.25}
        sx={{
          mb: 1,
          height: 8,
          alignItems: 'center',
          bgcolor: 'background.elevation1',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {categories.map((category) => (
          <Tooltip title={category.name} arrow key={category.name}>
            <Box
              sx={{
                height: 8,
                width: (category.spaceUsedinKb / totalSpaceinKb) * 100 + '%',
                bgcolor: category.color,
                cursor: 'pointer',
              }}
            />
          </Tooltip>
        ))}
      </Stack>
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          fontWeight: 'medium',
          color: 'text.secondary',
        }}
      >
        {`Used: ${convertSize(totalSpaceUsedinKb)} GB of ${convertSize(totalSpaceinKb)} GB`}
      </Typography>
    </>
  );
};

export default StorageBar;
