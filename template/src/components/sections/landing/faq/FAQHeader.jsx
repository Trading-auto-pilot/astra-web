import { Box, InputAdornment } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import PageHeader from '../common/PageHeader';
import RevealItems from '../common/RevealItems';
import SectionHeader from '../common/SectionHeader';

const FAQHeader = () => {
  return (
    <PageHeader>
      <SectionHeader title="FAQ" subtitle="How can we help?" sx={{ mb: 3 }} />

      <RevealItems component={Box} delay={0.3} sx={{ maxWidth: 400, width: 1 }}>
        <StyledTextField
          placeholder="Search by keyword"
          autoComplete="off"
          sx={{ width: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="material-symbols:search-rounded" fontSize={20} />
                </InputAdornment>
              ),
            },
          }}
        />
      </RevealItems>
    </PageHeader>
  );
};

export default FAQHeader;
