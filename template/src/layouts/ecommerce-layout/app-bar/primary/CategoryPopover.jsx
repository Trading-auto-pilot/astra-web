import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Link,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Popover,
  Stack,
  Typography,
  popoverClasses,
  useTheme,
} from '@mui/material';
import { categories } from 'data/e-commerce/homepage';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';

const CategoryList = ({ categories, anchorEl, level, openItem, setOpenItem }) => {
  const ref = useRef(null);
  const { direction } = useTheme();
  const { up, down } = useBreakpoints();
  const upMd = up('md');
  const downMd = down('md');
  const [selectedCategory, setSetselectedCategory] = useState(null);

  return (
    <>
      <Stack
        direction="column"
        sx={{
          gap: 3,
        }}
      >
        {categories.map((category) => (
          <List
            key={category.id}
            component="nav"
            dense
            disablePadding
            aria-labelledby="category-list"
            subheader={
              category.label ? (
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  sx={{
                    color: 'text.primary',
                    typography: 'overline',
                    fontWeight: 'bold',
                    mb: 1,
                    bgcolor: 'background.menu',
                  }}
                >
                  {category.label}
                </ListSubheader>
              ) : undefined
            }
          >
            {category.items?.map((item) => (
              <ListItemButton
                key={item.id}
                component={item.items ? 'div' : Link}
                href={item.items ? undefined : item.url}
                onClick={() => {
                  if (item.items) {
                    setOpenItem(level + 1);
                    setSetselectedCategory(item);
                  } else {
                    setOpenItem(0);
                  }
                }}
                sx={{
                  borderRadius: 0,
                  backgroundImage: 'none',
                }}
              >
                <ListItemText primary={item.title} />

                {item.items && (
                  <IconifyIcon
                    icon="material-symbols-light:keyboard-arrow-right"
                    sx={{ fontSize: 20 }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>
        ))}
      </Stack>
      <Popover
        open={openItem >= level + 1}
        anchorEl={anchorEl}
        onClose={() => {
          setSetselectedCategory(null);
        }}
        container={anchorEl}
        hideBackdrop
        anchorOrigin={
          upMd
            ? {
                vertical: 'top',
                horizontal: direction === 'rtl' ? 'left' : 'right',
              }
            : {
                vertical: 'top',
                horizontal: direction === 'rtl' ? 'right' : 'left',
              }
        }
        transformOrigin={{
          vertical: 'top',
          horizontal: direction === 'rtl' ? 'right' : 'left',
        }}
        slotProps={{
          paper: {
            sx: [
              openItem > level + 1 && {
                borderRadius: 0,
              },
              openItem === level + 1 && {
                borderRadius: '0 8px 8px 0',
              },
            ],
          },
        }}
        sx={[
          {
            position: { xs: 'absolute', md: 'fixed' },
            pointerEvents: 'none',
            [`& .${popoverClasses.paper}`]: {
              pointerEvents: 'auto',
              boxShadow: (theme) => theme.vars.shadows[3],
            },
          },
          downMd && {
            [`& .${popoverClasses.paper}`]: {
              height: '100%',
              width: '100%',
              maxHeight: '100%',
              maxWidth: '100%',
              top: `0 !important`,
              left: '0 !important',
              bottom: '0 !important',
              right: '0 !important',
            },
          },
        ]}
      >
        <Box
          ref={ref}
          sx={{
            overflow: 'hidden',
            py: 2,
          }}
        >
          <Stack
            sx={{
              justifyContent: 'space-between',
              mb: 3,
              px: 2,
            }}
          >
            <Button
              shape="circle"
              variant="soft"
              color="neutral"
              onClick={() => {
                setOpenItem(level);
                setSetselectedCategory(null);
              }}
            >
              <IconifyIcon icon="material-symbols:arrow-back-rounded" sx={{ fontSize: 20 }} />
            </Button>
            <Button
              shape="circle"
              variant="soft"
              color="neutral"
              onClick={() => {
                setOpenItem(level);
                setSetselectedCategory(null);
              }}
            >
              <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
            </Button>
          </Stack>
          <SimpleBar disableHorizontal sx={{ height: '100%' }}>
            <CategoryList
              categories={selectedCategory ? [selectedCategory] : []}
              anchorEl={ref.current}
              level={level + 1}
              openItem={openItem}
              setOpenItem={setOpenItem}
            />
          </SimpleBar>
        </Box>
      </Popover>
    </>
  );
};

const CategoryPopover = ({ anchorEl, openItem, setOpenItem, handleClose }) => {
  const ref = useRef(null);
  const { direction } = useTheme();

  return (
    <Popover
      open={!!anchorEl && openItem >= 1}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 50,
        horizontal: direction === 'rtl' ? 'right' : 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: direction === 'rtl' ? 'right' : 'left',
      }}
      slotProps={{
        paper: {
          sx: [
            openItem > 1 && {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
          ],
        },
      }}
      sx={{
        [`& .${popoverClasses.paper}`]: {
          boxShadow: (theme) => theme.vars.shadows[3],
          minWidth: 360,
          height: '80vh',
        },
      }}
    >
      <Box
        ref={ref}
        sx={{
          overflow: 'hidden',
          py: 2,
        }}
      >
        <Stack
          sx={{
            justifyContent: 'space-between',
            mb: 3,
            px: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
            }}
          >
            Category
          </Typography>

          <Button
            shape="circle"
            variant="soft"
            color="neutral"
            onClick={() => {
              setOpenItem(0);
            }}
          >
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Stack>
        <SimpleBar disableHorizontal sx={{ height: '100%' }}>
          <CategoryList
            categories={categories}
            anchorEl={ref.current}
            level={1}
            openItem={openItem}
            setOpenItem={setOpenItem}
          />
        </SimpleBar>
      </Box>
    </Popover>
  );
};

export default CategoryPopover;
