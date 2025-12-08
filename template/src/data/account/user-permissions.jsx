import { Stack, Typography } from '@mui/material';

export const globalPermissions = [
  {
    name: 'administrator',
    checked: false,
    label: (
      <Stack key="administrator-label" direction="column" spacing={0.5}>
        <Typography key="administrator-title" variant="subtitle2" sx={{ fontWeight: 700 }}>
          Administrator
        </Typography>
        <Typography key="administrator-subtitle" variant="body2" sx={{ color: 'text.secondary' }}>
          Has full access but can't transfer ownership
        </Typography>
      </Stack>
    ),
  },
  {
    name: 'billing',
    checked: false,
    label: (
      <Stack key="billing-label" direction="column" spacing={0.5}>
        <Typography key="billing-title" variant="subtitle2" sx={{ fontWeight: 700 }}>
          Billing
        </Typography>
        <Typography key="billing-subtitle" variant="body2" sx={{ color: 'text.secondary' }}>
          Users can modify plans, but domains and Google Workspace are excluded.
        </Typography>
      </Stack>
    ),
  },
];

export const userPermissions = [
  {
    name: 'deleteAccount',
    checked: false,
    label: 'Permit Users to Delete Their Accounts',
  },
  {
    name: 'createOrganizatio',
    checked: true,
    label: 'Enable Users to Create Organizations',
  },
];
