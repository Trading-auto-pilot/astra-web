import { useState } from 'react';
import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { currencyFormat, kebabCase, kebabToSentenceCase, numberFormat } from 'lib/utils';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const ProductCard = ({ product, sx, children }) => {
  const [image, setImage] = useState(product.images[0].src);
  const [productColor, setProductColor] = useState(product.images[0].color || '');

  const handleColorChange = (event) => {
    const selectedColor = event.target.value;
    setProductColor(selectedColor);

    const imageObject = product.images.find((img) => img.color === selectedColor);
    if (imageObject) {
      setImage(imageObject.src);
    }
  };

  return (
    <Stack
      component={Link}
      href={paths.productDetails(String(product.id))}
      underline="none"
      direction="column"
      sx={{
        justifyContent: 'space-between',
        height: 1,
        color: 'currentcolor',
        textAlign: 'center',
        p: { xs: 3, lg: 5 },
        borderRadius: 2,
        '&:hover': {
          bgcolor: 'background.elevation1',
        },

        ...sx,
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ position: 'relative', height: 240, width: 1, mb: 2 }}>
          <Image
            src={image}
            alt={kebabCase(product.name)}
            sx={{ objectFit: 'contain', height: 1, width: 1 }}
          />
          <Stack
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              width: 1,
            }}
          >
            {!product.availability?.includes('in-stock') ? (
              <Chip
                variant="soft"
                color="error"
                label={kebabToSentenceCase(product.availability[0])}
              />
            ) : (
              <div />
            )}
            {product.images.length > 1 && (
              <FormControl component="fieldset">
                <RadioGroup
                  name="product-color"
                  aria-labelledby="product-color-radio-buttons-group"
                  value={productColor}
                  onChange={handleColorChange}
                  row
                >
                  {product.images.map(({ color }) => (
                    <FormControlLabel
                      key={color}
                      value={color}
                      control={
                        <Radio
                          disableRipple
                          sx={{ p: 0 }}
                          icon={
                            <IconifyIcon
                              icon="material-symbols:crop-square"
                              sx={{ fontSize: 22, color }}
                            />
                          }
                          checkedIcon={
                            <IconifyIcon
                              icon="material-symbols:check-box"
                              sx={{ fontSize: 22, color }}
                            />
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label=""
                      sx={{ color }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </Stack>
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            lineClamp: 2,
            mb: 1,
          }}
        >
          {product.name}
        </Typography>
        <Stack
          sx={{
            gap: 0.5,
            justifyContent: 'center',
          }}
        >
          {product.tags.map((tag) => (
            <Chip key={kebabCase(tag)} variant="soft" label={tag} />
          ))}
        </Stack>
      </Box>
      <div>
        {product.stock <= 2 && product.stock > 0 && (
          <Typography
            variant="caption"
            sx={{
              color: 'error',
              display: 'inline-block',
              fontWeight: 'medium',
              mb: 1.5,
            }}
          >
            Only {product.stock} left in stock (more on the way)
          </Typography>
        )}
        <Stack
          sx={{
            gap: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <Rating size="small" value={product.ratings} readOnly />
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            ({numberFormat(product.sold)} sold)
          </Typography>
        </Stack>
        <Typography
          variant="h4"
          sx={{
            lineHeight: 1.5,
            mb: 0.5,
          }}
        >
          {currencyFormat(product.price.discounted)}
        </Typography>
        <Stack
          sx={{
            gap: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              textDecoration: 'line-through',
            }}
          >
            {currencyFormat(product.price.regular)}
          </Typography>
          <Chip variant="soft" color="success" label="Save 50%" />
        </Stack>
        {children}
      </div>
    </Stack>
  );
};

export default ProductCard;
