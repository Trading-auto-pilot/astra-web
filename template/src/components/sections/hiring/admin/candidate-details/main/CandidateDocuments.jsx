import { useState } from 'react';
import { Box, Button, Stack, Tab, Tabs, tabClasses, tabsClasses } from '@mui/material';
import { initialConfig } from 'config';
import { cssVarRgba } from 'lib/utils';

const CandidateDocuments = () => {
  const [value, setValue] = useState(0);

  const pdf = (() => {
    switch (value) {
      case 0:
        return `${initialConfig.assetsDir}/files/verification-letter.pdf`;
      case 1:
        return `${initialConfig.assetsDir}/files/verification-letter.pdf`;
      case 2:
        return `${initialConfig.assetsDir}/files/verification-letter.pdf`;
      default:
        return `${initialConfig.assetsDir}/files/verification-letter.pdf`;
    }
  })();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack direction="column" sx={{ height: 1 }}>
      <Stack sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={(theme) => ({
            p: 0.5,
            borderRadius: 1.5,
            flexShrink: 0,
            bgcolor: 'background.elevation1',
            [`& .${tabsClasses.list}`]: {
              gap: 0,
            },
            [`& .${tabsClasses.indicator}`]: {
              height: 1,
              bgcolor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.15),
              borderRadius: 1,
            },
            [`& .${tabClasses.root}`]: {
              color: 'text.primary',
              fontWeight: 600,
              textTransform: 'none',
              [`&.${tabClasses.selected}`]: {
                color: 'primary.dark',
              },
            },
          })}
        >
          <Tab label="Resume" disableRipple />
          <Tab label="Cover letter" disableRipple />
          <Tab label="Portfolio" disableRipple />
        </Tabs>

        <Button variant="text" color="neutral">
          Download All
        </Button>
      </Stack>

      <Box
        sx={{
          height: 1,
          flex: 1,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <object data={`${pdf}`} type="application/pdf" width="100%" height="100%"></object>
      </Box>
    </Stack>
  );
};

export default CandidateDocuments;
