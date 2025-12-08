import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse, { collapseClasses } from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import CRMDropdownMenu from '../../CRMDropdownMenu';
import EmailFile from './EmailFile';

const EmailAccordion = ({ email }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { up } = useBreakpoints();

  const upSm = up('sm');

  return (
    <Stack
      direction="column"
      sx={{
        borderRadius: 6,
        p: 2,
        bgcolor: 'background.elevation1',
      }}
    >
      <Stack
        sx={{
          bgcolor: 'background.elevation1',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack
          gap={2}
          flexGrow={1}
          role="button"
          onClick={() => setOpen(!open)}
          sx={{ cursor: 'pointer', alignItems: 'center' }}
        >
          {email.avatar && typeof email.avatar === 'string' ? (
            <Avatar src={email.avatar} sx={{ width: 48, height: 48 }} />
          ) : (
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.lighter' }}>
              {email.avatar}
            </Avatar>
          )}
          <Stack direction="column" gap={1}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {email.name}
              </Typography>
              {upSm && email.sentVia && (
                <Stack gap={0.5} sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Sent via{' '}
                  </Typography>
                  <Typography variant="subtitle2">{email.sentVia}</Typography>
                </Stack>
              )}
            </Stack>
            <Typography
              component="p"
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 500 }}
            >
              {dayjs(email.sentAt).format('h:mm a DD MMM, YYYY')}
            </Typography>
          </Stack>
        </Stack>
        <Button
          size="small"
          shape="square"
          color="neutral"
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
        >
          <IconifyIcon icon="material-symbols:more-horiz" sx={{ fontSize: 18 }} />
        </Button>
        <CRMDropdownMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          handleClose={() => setAnchorEl(null)}
        />
      </Stack>
      <Collapse
        in={open}
        sx={{
          [`& .${collapseClasses.wrapperInner}`]: {
            mt: 2,
          },
        }}
      >
        <Stack direction="column" gap={2}>
          {email.message}
          {email.attachment && email.attachment.length > 0 && (
            <Stack gap={1} sx={{ overflow: 'hidden' }}>
              {email.attachment.map((attachment) => (
                <Stack key={attachment.src} direction="column" gap={1}>
                  <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Image
                      src={attachment.src}
                      sx={{ objectFit: 'fill', height: 1, width: 1, borderRadius: 2 }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {attachment.name}
                    <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400 }}>
                      {' ' + attachment.size}
                    </Box>
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
          {email.files && email.files.length > 0 && (
            <Stack gap={1} sx={{ flexWrap: 'wrap' }}>
              {email.files.map((file) => (
                <EmailFile key={file.file.name} file={file} />
              ))}
            </Stack>
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default EmailAccordion;
