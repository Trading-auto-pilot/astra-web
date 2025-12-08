import { Box, Typography } from '@mui/material';
import { kebabCase } from 'lib/utils';

const ProductDescription = ({ descriptions }) => {
  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Description
      </Typography>
      {descriptions.map(({ title, description }) => (
        <Box
          key={kebabCase(title)}
          sx={{
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.5,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {title} :
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {description}
          </Typography>
        </Box>
      ))}
    </div>
  );
};

export default ProductDescription;
