import {
  Box,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const Logs = ({ logs, children, warning }) => {
  return (
    <Paper
      variant="elevation"
      background={1}
      elevation={0}
      sx={{ borderRadius: 6, p: { xs: 3, md: 5 } }}
    >
      {warning && warning}

      {children}

      {Object.entries(logs).map(([category, items]) => (
        <Box key={category} sx={{ '&:not(:last-of-type)': { mb: 4 } }}>
          <Typography fontWeight={700} sx={{ mb: 2 }}>
            {category}
          </Typography>
          <List dense disablePadding>
            {items.map((item, idx) => (
              <ListItem key={idx} disableGutters disablePadding sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon
                  sx={{
                    minWidth: 22,
                    height: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 1,
                  }}
                >
                  <IconifyIcon icon="material-symbols:circle" fontSize={8} color="text.primary" />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={(() => {
                    if (!item.link) return item.text;

                    if (typeof item.link === 'string') {
                      return (
                        <Box component="span">
                          {item.text}
                          {': '}
                          <Link target="_blank" href={item.link} underline="hover">
                            {item.link}
                          </Link>
                        </Box>
                      );
                    }

                    if (typeof item.link === 'object' && item.link.href) {
                      return (
                        <Box component="span">
                          {item.text}
                          {': '}
                          <Link target="_blank" href={item.link.href} underline="hover">
                            {item.link.linkText || item.link.href}
                          </Link>
                        </Box>
                      );
                    }

                    return item.text;
                  })()}
                  sx={{ wordBreak: 'break' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Paper>
  );
};

export default Logs;
