import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  Stack,
  TextField,
  Typography,
  dialogClasses,
  inputBaseClasses,
  listItemTextClasses,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import ProductVariantListItem from '../../admin/common/ProductVariantListItem';

const ProductGiftDialogue = ({ cartItem, open, handleClose }) => {
  const { name, images } = cartItem;

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="gift-dialog"
      open={open}
      sx={{
        [`& .${dialogClasses.paper}`]: {
          bgcolor: 'background.menu',
          outline: 'none',
          maxWidth: 490,
          m: { xs: 2, sm: 4 },
          borderRadius: 6,
        },
      }}
    >
      <DialogTitle
        mb={3}
        variant="h6"
        sx={{ px: { xs: 3, md: 5 }, pt: { xs: 3, md: 5 }, pb: 0, mb: 3 }}
        id="customized-dialog-title"
      >
        Gift this item to a loved one?
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 3, md: 5 }, pb: { xs: 4, md: 2 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            gap: 2.5,
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 98,
              height: 98,
              borderRadius: 4,
              bgcolor: 'background.elevation1',
              flexShrink: 0,
            }}
          >
            <Image src={images[0].src} alt="" sx={{ width: 1, objectFit: 'contain' }} />
          </Box>
          <div>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2.5,
              }}
            >
              {name}
            </Typography>

            <List dense disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {cartItem.variants?.map((variant) => (
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
              <ProductVariantListItem
                label="Quantity"
                value={String(cartItem.quantity)}
                sx={{
                  [`& .${listItemTextClasses.primary}`]: {
                    minWidth: 85,
                  },
                }}
              />
            </List>
          </div>
        </Stack>

        <Stack
          sx={{
            gap: { xs: 1, sm: 2 },
            mb: 7,
          }}
        >
          <TextField variant="filled" fullWidth label="To" />
          <TextField variant="filled" fullWidth label="From" />
        </Stack>

        <CheckboxField
          title="Gift message"
          subtitle="Add a personalised message that will be printed on the packing slip"
          price="Free"
          name="gift-message"
          sx={{ mb: 4 }}
        />

        <TextField
          label="Message (optional)"
          multiline
          helperText={
            <>
              <IconifyIcon icon="material-symbols:info-outline-rounded" fontSize={16} />
              Maximum 60 characters
            </>
          }
          rows={3}
          fullWidth
          sx={{ mb: 4 }}
          slotProps={{
            input: {
              sx: {
                [`& .${inputBaseClasses.inputMultiline}`]: {
                  padding: 0,
                },
              },
            },
            formHelperText: {
              sx: {
                display: 'flex',
                gap: 1,
                alignItems: 'center',
              },
            },
          }}
        />

        <CheckboxField
          title="Gift box"
          subtitle="We’ll wrap your gift in a silver box with ribbons like this one"
          price="$5"
          name="gift-box"
        />
      </DialogContent>
      <DialogActions sx={{ p: { xs: 3, md: 5 }, justifyContent: 'flex-start' }}>
        <Button variant="contained" onClick={handleClose} sx={{ minWidth: 160 }}>
          Save
        </Button>

        <Button variant="text" color="neutral" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CheckboxField = ({ title, subtitle, price, name, sx }) => {
  return (
    <Stack
      sx={{
        gap: 3,
        alignItems: 'center',
        ...sx,
      }}
    >
      <Checkbox name={name} sx={{ p: 0, flexShrink: 0 }} />
      <Stack
        sx={{
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ height: 64, width: 64, bgcolor: 'neutral.lighter', color: 'text.primary' }}>
          <IconifyIcon icon="ic:outline-draw" fontSize={32} />
        </Avatar>
        <div>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            {title}
            <Box
              component="span"
              sx={{
                color: 'text.secondary',
                ml: 1,
              }}
            >
              ( {price} )
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
            }}
          >
            {subtitle}
          </Typography>
        </div>
      </Stack>
    </Stack>
  );
};

export default ProductGiftDialogue;
