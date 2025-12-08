import { List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { kebabCase } from 'lib/utils';

const ProductSpecification = ({ specifications }) => {
  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Specification
      </Typography>
      <List dense disablePadding>
        {specifications.map(({ label, value }) => (
          <ListItem
            key={kebabCase(label)}
            disablePadding
            disableGutters
            sx={{ mb: 2, '&:last-of-type': { mb: 0 } }}
          >
            <ListItemText
              disableTypography
              sx={{ m: 0 }}
              primary={
                <Stack
                  sx={{
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      minWidth: 128,
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {value}
                  </Typography>
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProductSpecification;
