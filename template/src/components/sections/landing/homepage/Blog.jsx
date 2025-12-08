import { Link } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import Image from 'components/base/Image';
import SectionHeader from '../common/SectionHeader';

const Blog = ({ data }) => {
  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 4, sm: 8 } }}>
      <SectionHeader title="Blog" subtitle="Explore articles on different topics" sx={{ mb: 5 }} />

      <Container maxWidth={false} sx={{ maxWidth: 1200, px: { xs: 0 } }}>
        <Grid container spacing={3}>
          {data.map((blog) => (
            <Grid key={blog.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <BlogCard blog={blog} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const BlogCard = ({ blog }) => {
  return (
    <Stack direction="column" gap={3} position="relative">
      <div>
        <Box
          sx={{
            width: 1,
            height: 216,
            mb: 3,
            overflow: 'hidden',
            filter: 'grayscale(1)',
            borderRadius: 6,
            transition: ({ transitions }) =>
              transitions.create('filter', {
                duration: transitions.duration.standard,
              }),
            '&:hover': {
              filter: 'grayscale(0)',
            },
          }}
        >
          <Image
            src={blog.img}
            sx={{
              objectFit: 'cover',
              width: 1,
              height: 1,
            }}
          />
        </Box>

        <div>
          <Stack gap={3} alignItems="center" mb={1}>
            <Stack gap={2} alignItems="center">
              <Chip label="Nature" variant="soft" color="neutral" />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {blog.timeRead}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {dayjs(blog.date).format('D MMM, YYYY')}
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            <Link href="#!" color="inherit">
              {blog.title}
            </Link>
          </Typography>
        </div>
      </div>

      <Stack gap={2} alignItems="center">
        <Avatar src={blog.user.avatar} sx={{ width: 40, height: 40 }} />
        <Stack direction="column" gap={0.5}>
          <Typography variant="subtitle2">{blog.user.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {blog.designation}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Blog;
