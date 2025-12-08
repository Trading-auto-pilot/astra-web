import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getRangeLabel } from 'lib/utils';

const CompanyInfo = ({ company }) => {
  return (
    <Stack direction="column" gap={1}>
      <Stack direction={{ xs: 'row', md: 'column', lg: 'row' }} alignItems="flex-start" gap={2}>
        <Avatar
          variant="rounded"
          src={company.logo}
          alt={company.logo}
          sx={{ width: 48, height: 48, borderRadius: 2, flexShrink: 0, bgcolor: 'transparent' }}
        />
        <Stack direction="column" gap={0.5}>
          <Typography variant="subtitle1" fontWeight={700} color="neutral.main">
            {company.name}
          </Typography>
          <Stack gap={1} flexWrap="wrap">
            <Typography variant="caption" fontWeight={500} color="text.secondary">
              {company.type}
            </Typography>
            <Typography variant="caption" fontWeight={500} color="text.secondary">
              {getRangeLabel(company.employees)} Employyes
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ lineClamp: 2, overflow: 'hidden' }}>
        {company.desc}
      </Typography>
    </Stack>
  );
};

export default CompanyInfo;
