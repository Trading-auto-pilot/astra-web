import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import QuantityButtons from 'components/sections/ecommerce/customer/common/QuantityButtons';

const CartItem = ({ item, handleRemove }) => {
  const { currencyFormat } = useNumberFormat();
  const { updateCartItem } = useEcommerce();
  const { id, price, images, name, quantity } = item;

  const handleQuantityChange = (quantity) => {
    updateCartItem(item.id, { quantity });
  };

  return (
    <Stack
      key={id}
      sx={{
        gap: 2,
        alignItems: 'flex-start',
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
      <Stack
        sx={{
          gap: 2,
          flex: 1,
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: 'background.elevation2',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image alt={`product${id}`} src={images[0].src} sx={{ width: 1, objectFit: 'contain' }} />
        </Box>
        <div>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 'bold',
              lineClamp: 2,
              mb: 2,
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

          <List dense disablePadding sx={{ mb: 2 }}>
            <ListItem disablePadding disableGutters sx={{ mb: 1 }}>
              <ListItemText
                sx={{ m: 0 }}
                primary={
                  <Typography
                    component="p"
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        minWidth: 80,
                        display: 'inline-block',
                      }}
                    >
                      Size
                    </Box>
                    :
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 400,
                        display: 'inline-block',
                        ml: 1,
                      }}
                    >
                      S
                    </Box>
                  </Typography>
                }
              />
            </ListItem>
            <ListItem disablePadding disableGutters>
              <ListItemText
                sx={{ m: 0 }}
                primary={
                  <Typography
                    component="p"
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        minWidth: 80,
                        display: 'inline-block',
                      }}
                    >
                      Color
                    </Box>
                    :
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 400,
                        display: 'inline-block',
                        ml: 1,
                      }}
                    >
                      Satin linen
                    </Box>
                  </Typography>
                }
              />
            </ListItem>
          </List>

          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              mb: 2,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            Each
            <span>
              <Box
                component="span"
                sx={{
                  color: 'error.main',
                  textDecoration: 'line-through',
                  mr: 1,
                }}
              >
                {currencyFormat(price.regular)}
              </Box>
              <Box
                component="span"
                sx={{
                  color: 'text.primary',
                  fontWeight: 'bold',
                }}
              >
                {currencyFormat(price.discounted)}
              </Box>
            </span>
          </Typography>
          <Box
            sx={{
              mb: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 'bold',
                display: 'inline-block',
                mb: 2,
              }}
            >
              Quantity
            </Typography>
            <QuantityButtons defaultValue={quantity} handleChange={handleQuantityChange} />
          </Box>
          <Stack
            sx={{
              gap: 1,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="h5">{currencyFormat(price.discounted * quantity)}</Typography>
            <Chip variant="soft" color="success" label="Save 40%" />
          </Stack>
        </div>
      </Stack>
      <IconButton size="small" disableRipple onClick={() => handleRemove(id)}>
        <IconifyIcon icon="material-symbols:close-rounded" />
      </IconButton>
    </Stack>
  );
};

export default CartItem;
