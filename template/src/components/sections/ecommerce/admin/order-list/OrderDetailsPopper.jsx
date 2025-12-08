import { useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Grow,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { orderListAdmin } from 'data/e-commerce/orders';
import useNumberFormat from 'hooks/useNumberFormat';

const OrderDetailsPopper = ({ params }) => {
  const { currencyFormat } = useNumberFormat();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHoveringPopper, setIsHoveringPopper] = useState(false);
  const linkRef = useRef(null);

  const hoveredOrder = useMemo(
    () => orderListAdmin.find((order) => order.id === params.row.id) || null,
    [params.row.id],
  );

  const orderTotal = useMemo(
    () =>
      (hoveredOrder?.items || []).reduce(
        (total, item) => total + item.product.price.discounted * item.quantity,
        0,
      ),
    [hoveredOrder],
  );

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    if (!isHoveringPopper) {
      setAnchorEl(null);
    }
  };

  const handlePopperMouseEnter = () => {
    setIsHoveringPopper(true);
  };

  const handlePopperMouseLeave = () => {
    setIsHoveringPopper(false);
    setAnchorEl(null);
  };

  const hasItems = hoveredOrder?.items && hoveredOrder.items.length > 0;

  return (
    <>
      <Link
        ref={linkRef}
        variant="subtitle2"
        href="#!"
        sx={{ fontWeight: 400 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {params.row.id}
      </Link>

      <Popper
        open={Boolean(anchorEl) || isHoveringPopper}
        anchorEl={anchorEl || linkRef.current}
        transition
        sx={{ width: 326 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={350}>
            <Paper
              variant="elevation"
              elevation={6}
              onMouseEnter={handlePopperMouseEnter}
              onMouseLeave={handlePopperMouseLeave}
              sx={{
                p: 2,
                borderRadius: 6,
                backgroundImage: 'none',
                bgcolor: (theme) => theme.vars.palette.background.menu,
                flexDirection: 'column',
                width: 326,
              }}
            >
              <List dense disablePadding sx={{ mb: 2 }}>
                {hasItems ? (
                  hoveredOrder.items.map((item, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemAvatar sx={{ minWidth: 40 }}>
                        <Avatar
                          src={item.product.images[0].src}
                          sx={{
                            height: 32,
                            width: 32,
                            borderRadius: 2,
                            bgcolor: 'background.elevation2',
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        primary={item.product.name}
                        slotProps={{
                          primary: {
                            sx: {
                              fontWeight: 600,
                              flex: 1,
                              overflow: 'hidden',
                              lineClamp: 1,
                              wordBreak: 'break-all',
                            },
                          },
                        }}
                        secondary={
                          <Stack
                            component="span"
                            gap={0.4}
                            sx={{ width: 114, justifyContent: 'space-between' }}
                          >
                            <Typography
                              variant="caption"
                              color="text.disabled"
                              sx={{ width: 46, textAlign: 'right' }}
                            >
                              {item.quantity} pcs
                            </Typography>
                            <Typography variant="caption" color="text.primary">
                              {currencyFormat(item.product.price.discounted * item.quantity)}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No items in this order
                  </Typography>
                )}
              </List>

              <Stack alignItems="center" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {currencyFormat(orderTotal)}
                </Typography>
              </Stack>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default OrderDetailsPopper;
