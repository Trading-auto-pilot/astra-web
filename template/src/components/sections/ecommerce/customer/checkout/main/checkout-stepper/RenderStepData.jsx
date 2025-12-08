import { List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { kebabCase } from 'lib/utils';

const RenderStepData = ({ stepData }) => {
  return (
    <List dense disablePadding sx={{ pl: 5, mt: 3 }}>
      {stepData.map(
        ({ label, value }) =>
          value && (
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
                  <Stack direction={{ xs: 'column', sm: 'row' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        minWidth: 220,
                      }}
                    >
                      {label}:
                    </Typography>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {String(value)}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          ),
      )}
    </List>
  );
};

export default RenderStepData;
