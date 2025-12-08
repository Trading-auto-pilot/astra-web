import { InputAdornment } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';
import StyledTextField from 'components/styled/StyledTextField';

const FaqPageHeader = () => {
  return (
    <Paper sx={{ px: { xs: 3, md: 5 }, py: 5 }}>
      <Stack
        sx={{
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'flex-end' },
          justifyContent: 'space-between',
        }}
      >
        <div>
          <PageBreadcrumb
            items={[
              { label: 'Misc', url: '#!' },
              { label: 'Faq', active: true },
            ]}
            sx={{ mb: 2 }}
          />
          <Typography variant="h4">Faq</Typography>
        </div>

        <StyledTextField
          id="search-box"
          type="search"
          size="medium"
          placeholder="Search by keyword"
          sx={{ maxWidth: { sm: 400 }, width: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon
                    icon="material-symbols:search-rounded"
                    sx={{ color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
    </Paper>
  );
};

export default FaqPageHeader;
