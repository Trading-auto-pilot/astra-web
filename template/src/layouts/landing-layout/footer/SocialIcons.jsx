import { Link, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import IconifyIcon from 'components/base/IconifyIcon';

const socialLinks = [
  {
    id: 'fb',
    icon: 'ri:facebook-circle-fill',
    href: '#!',
  },
  {
    id: 'ig',
    icon: 'ri:instagram-line',
    href: '#!',
  },
  {
    id: 'th',
    icon: 'ri:threads-line',
    href: '#!',
  },
  {
    id: 'x',
    icon: 'ri:twitter-x-fill',
    href: '#!',
  },
  {
    id: 'no',
    icon: 'ri:notion-fill',
    href: '#!',
  },
  {
    id: 'yt',
    icon: 'ri:youtube-fill',
    href: '#!',
  },
];

const SocialIcons = () => {
  return (
    <div>
      <Typography variant="overline" component="p" fontWeight={700} color="textDisabled" mb={2}>
        Socials
      </Typography>

      <Stack gap={4}>
        {socialLinks.map((item) => (
          <Link key={item.id} href={item.href} underline="none">
            <IconifyIcon
              icon={item.icon}
              sx={{
                fontSize: 24,
                color: 'text.disabled',
                '&:hover': {
                  color: 'text.secondary',
                },
              }}
            />
          </Link>
        ))}
      </Stack>
    </div>
  );
};

export default SocialIcons;
