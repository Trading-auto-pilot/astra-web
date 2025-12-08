import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useOrderDetails } from '../OrderDetailsProvider';

const FraudAnalysis = ({ sx }) => {
  const { order } = useOrderDetails();
  const { customer } = order;

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4, lg: 5 },
        ...sx,
      }}
    >
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
          }}
        >
          Fraud analysis
        </Typography>

        <Button variant="text" size="small" sx={{ flexShrink: 0, minWidth: 0 }}>
          View
        </Button>
      </Stack>
      <List dense disablePadding>
        <ListItem disableGutters sx={{ gap: 2 }}>
          <ListItemIcon sx={{ minWidth: 0 }}>
            <IconifyIcon icon="material-symbols:circle" fontSize={8} color="divider" />
          </ListItemIcon>

          <ListItemText
            slotProps={{ primary: { color: 'text.secondary' } }}
            primary={
              customer?.fraudAnalysis?.cvvInfo ?? 'Card verification value (CVV) isn’t available'
            }
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default FraudAnalysis;
