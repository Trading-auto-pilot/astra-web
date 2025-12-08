import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import CRMDropdownMenu from '../../common/CRMDropdownMenu';
import CopyableText from '../../common/CopyableText';

const Contact = ({ contact }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <Stack
      direction="column"
      gap={3}
      sx={{ width: 1, borderRadius: 2, p: 2, bgcolor: 'background.elevation1' }}
    >
      <Stack direction="column" gap={3}>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack gap={2}>
            <Avatar variant="rounded" src={contact.avatar} sx={{ width: 80, height: 80 }} />

            <Stack direction="column" gap={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {contact.name}
              </Typography>

              <Stack direction="column" gap={0.5}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {contact.designation}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {contact.company}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Button shape="square" color="neutral" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <IconifyIcon icon="material-symbols:more-horiz" sx={{ fontSize: 20 }} />
          </Button>
          <CRMDropdownMenu anchorEl={anchorEl} open={open} handleClose={() => setAnchorEl(null)} />
        </Stack>

        <Stack gap={1}>
          <Button shape="square" variant="soft" color="neutral" fullWidth>
            <IconifyIcon icon="material-symbols:call-outline-rounded" sx={{ fontSize: 20 }} />
          </Button>
          <Button shape="square" variant="soft" color="neutral" fullWidth>
            <IconifyIcon icon="material-symbols:mail-outline-rounded" sx={{ fontSize: 20 }} />
          </Button>
          <Button shape="square" variant="soft" color="neutral" fullWidth>
            <IconifyIcon icon="material-symbols:video-call-outline-rounded" sx={{ fontSize: 20 }} />
          </Button>
          <Button shape="square" variant="soft" color="neutral" fullWidth>
            <IconifyIcon icon="material-symbols:calendar-add-on" sx={{ fontSize: 20 }} />
          </Button>
        </Stack>

        <TableContainer sx={{ borderRadius: 0, overflowY: 'hidden' }}>
          <Table
            sx={{
              '& th, & td, & th:first-of-type, & th:last-of-type, & td:first-of-type, & td:last-of-type':
                { px: '4px !important', textWrap: 'nowrap' },
              [`& .${tableCellClasses.root}`]: { p: 0, borderBottom: 0 },
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Phone No.</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email Id</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Contact Owner
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  {contact.contactInfo.phone}
                </TableCell>
                <TableCell align="left">
                  <CopyableText text={contact.contactInfo.email} />
                </TableCell>
                <TableCell align="right">
                  <Stack sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                    {contact.contactInfo.contactOwner.map((owner) => (
                      <Chip
                        key={owner.id}
                        label={owner.name}
                        variant="soft"
                        avatar={<Avatar src={owner.avatar} />}
                      />
                    ))}
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
};

export default Contact;
