import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Link,
  List,
  Stack,
  Typography,
  listItemTextClasses,
} from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import ProductVariantListItem from '../../admin/common/ProductVariantListItem';
import QuantityButtons from '../common/QuantityButtons';
import ProductGiftDialogue from './ProductGiftDialogue';

const CartItem = ({ item }) => {
  const [sendAsGift, setSendAsGift] = useState(false);
  const [openGiftDialog, setOpenGiftDialog] = useState(false);
  const { updateCartItem, removeItemFromCart } = useEcommerce();
  const { currencyFormat } = useNumberFormat();
  const { up } = useBreakpoints();
  const upLg = up('lg');
  const upSm = up('sm');

  const { id, name, images, price, stock, quantity } = item;

  const handleQuantityChange = (quantity) => {
    updateCartItem(item.id, { quantity });
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: 'background.elevation1', borderRadius: 6 }}>
      <Stack
        sx={{
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Checkbox
          name={`product${id}`}
          sx={{ p: 0, flexShrink: 0 }}
          defaultChecked={item.selected}
          onChange={(e) => {
            updateCartItem(item.id, { selected: e.target.checked });
          }}
        />
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            sx={{
              gap: 5,
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <div>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  lineClamp: upLg ? 1 : 2,
                }}
              >
                <Link
                  href={paths.productDetails(String(item.id))}
                  sx={{
                    color: 'currentcolor',
                  }}
                >
                  {name}
                </Link>
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{
                  gap: 4,
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    flexShrink: 0,
                  }}
                >
                  <Image src={images[0].src} alt="" sx={{ width: 1, objectFit: 'contain' }} />
                </Box>

                <Stack
                  direction="column"
                  sx={{
                    gap: 2,
                    alignItems: 'start',
                  }}
                >
                  <Chip
                    variant="soft"
                    color={stock > 4 ? 'success' : 'warning'}
                    label={stock > 4 ? 'In stock' : `${stock} remaining`}
                  />

                  {item.variants && (
                    <List
                      dense
                      disablePadding
                      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                      {item.variants.map((variant) => (
                        <ProductVariantListItem
                          key={variant.label}
                          label={variant.label}
                          value={variant.value}
                          sx={{
                            [`& .${listItemTextClasses.primary}`]: {
                              minWidth: 85,
                            },
                          }}
                        />
                      ))}
                    </List>
                  )}
                  <Stack
                    sx={{
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      columnGap: 1,
                    }}
                  >
                    <FormControl component="fieldset">
                      <FormControlLabel
                        sx={{ m: 0, ml: '-9px' }}
                        control={
                          <Checkbox
                            checked={sendAsGift}
                            onChange={(e) => {
                              setSendAsGift(e.target.checked);
                            }}
                          />
                        }
                        label="Send as a gift"
                      />
                    </FormControl>
                    <ProductGiftDialogue
                      open={openGiftDialog}
                      cartItem={item}
                      handleClose={() => setOpenGiftDialog(false)}
                    />
                    <Button
                      size="small"
                      variant="text"
                      color="neutral"
                      disabled={!sendAsGift}
                      onClick={() => setOpenGiftDialog(true)}
                    >
                      Details
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </div>

            <Stack
              direction={{ xs: 'column', sm: 'row', lg: 'column' }}
              sx={{
                flexShrink: 0,
                alignItems: { xs: 'start', lg: 'flex-end' },
                rowGap: 3,
                justifyContent: 'space-between',
              }}
            >
              <Stack
                direction="column"
                sx={{
                  gap: 2,
                  alignItems: { xs: 'start', lg: 'flex-end' },
                }}
              >
                <Stack
                  sx={{
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    Each
                    <Box
                      component="strong"
                      sx={{
                        color: 'text.primary',
                        ml: 1,
                      }}
                    >
                      {currencyFormat(price.discounted)}
                    </Box>
                  </Typography>
                  {item.price.offer && (
                    <Chip variant="soft" color="success" label={`Save ${item.price.offer}`} />
                  )}
                </Stack>

                <Stack
                  sx={{
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.disabled',
                      textDecoration: 'line-through',
                    }}
                  >
                    {currencyFormat(price.regular)}
                  </Typography>
                  <Typography variant="h5">
                    {currencyFormat(price.discounted * quantity)}
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                direction="column"
                sx={{
                  gap: 2,
                  alignItems: { xs: 'flex-start', sm: 'flex-end' },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Quantity :
                </Typography>
                <QuantityButtons defaultValue={quantity} handleChange={handleQuantityChange} />
              </Stack>
            </Stack>
          </Stack>

          <Stack
            sx={{
              gap: 1.5,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Stack
              divider={<Divider orientation="vertical" flexItem />}
              sx={{
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              <Button
                variant="text"
                color="neutral"
                size="small"
                sx={{ whiteSpace: 'nowrap', minWidth: 0 }}
              >
                Edit
              </Button>
              <Button variant="text" color="neutral" size="small" sx={{ whiteSpace: 'nowrap' }}>
                Move to wishlist
              </Button>
            </Stack>

            <Button
              variant="text"
              color="error"
              shape={upSm ? undefined : 'square'}
              size="small"
              sx={{ whiteSpace: 'nowrap' }}
              onClick={() => {
                removeItemFromCart(item.id);
              }}
            >
              {upSm ? (
                'Remove'
              ) : (
                <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={16} />
              )}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CartItem;
