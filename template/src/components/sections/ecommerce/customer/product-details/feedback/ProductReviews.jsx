import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  MenuItem,
  Rating,
  Stack,
  Typography,
  chipClasses,
  dividerClasses,
  ratingClasses,
} from '@mui/material';
import { productReviewTags, productReviews } from 'data/e-commerce/products';
import { kebabCase } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';
import StyledTextField from 'components/styled/StyledTextField';

const ProductReviews = () => {
  const [activeTag, setActiveTag] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const handleChipClick = (label) => {
    setActiveTag(label);
  };

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          gap: 3,
          mb: 5,
          justifyContent: 'space-between',
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {productReviewTags.map((tag) => (
            <Chip
              key={kebabCase(tag.label)}
              label={
                <>
                  {tag.label}
                  <Typography
                    variant="subtitle2"
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color: tag.label === activeTag ? 'primary' : 'text.disabled',
                      ml: 0.5,
                      fontSize: '0.75rem',
                    }}
                  >
                    {tag.count}
                  </Typography>
                </>
              }
              color={tag.label === activeTag ? 'primary' : 'neutral'}
              size="medium"
              variant="soft"
              onClick={() => handleChipClick(tag.label)}
              sx={{
                textTransform: 'capitalize',
                [`& .${chipClasses.label}`]: {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            />
          ))}
        </Stack>
        <FormControl sx={{ maxWidth: { sm: 200 }, width: 1 }}>
          <StyledTextField
            select
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
            }}
          >
            <MenuItem value="recent">Sort by - Most recent</MenuItem>
            <MenuItem value="oldest">Sort by - Oldest</MenuItem>
            <MenuItem value="helpful">Sort by - Most helpful</MenuItem>
            <MenuItem value="relevant">Sort by - Most relevant</MenuItem>
          </StyledTextField>
        </FormControl>
      </Stack>
      <Stack
        direction="column"
        sx={{
          gap: 5,
        }}
      >
        {productReviews.map(({ id, user, date, content, helpfulCount }) => (
          <Box key={id}>
            <Stack
              sx={{
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Stack
                sx={{
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar alt={user.name} src={user.image} sx={{ width: 48, height: 48 }} />
                <div>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.disabled',
                    }}
                  >
                    {date}
                  </Typography>
                </div>
              </Stack>
              <DashboardMenu
                icon={<IconifyIcon icon="material-symbols-light:more-vert" fontSize={22} />}
                menuItems={[{ label: 'Hide' }, { label: 'Share' }, { label: 'Report abuse' }]}
              />
            </Stack>
            <Rating
              name="product-rating"
              value={5}
              readOnly
              icon={<IconifyIcon icon="material-symbols:star-rounded" />}
              sx={{
                mb: 2,
                [`& .${ratingClasses.iconFilled}`]: {
                  color: 'warning.main',
                },
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
                fontWeight: 700,
                mb: 1,
              }}
            >
              {content.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: { xs: 4, sm: 2 },
              }}
            >
              {content.body}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              divider={<Divider orientation="vertical" flexItem />}
              sx={{
                columnGap: 3,
                rowGap: 1,
                alignItems: { sm: 'center' },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {helpfulCount} people found it helpful
              </Typography>
              <Stack
                sx={{
                  gap: 1.5,
                }}
              >
                <Button
                  variant="text"
                  color="neutral"
                  size="small"
                  startIcon={<IconifyIcon icon="material-symbols:thumb-up-outline-rounded" />}
                >
                  Helpful
                </Button>
                <Button
                  variant="text"
                  color="neutral"
                  size="small"
                  startIcon={<IconifyIcon icon="material-symbols:thumb-down-outline-rounded" />}
                >
                  Not helpful
                </Button>
              </Stack>
            </Stack>
          </Box>
        ))}
        <Divider sx={{ [`& .${dividerClasses.wrapper}`]: { p: 0 } }}>
          <Button color="neutral" variant="soft" sx={{ borderRadius: 10 }}>
            Load more
          </Button>
        </Divider>
      </Stack>
    </>
  );
};

export default ProductReviews;
