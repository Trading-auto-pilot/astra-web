import { useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Box, Button, Checkbox, InputAdornment, Stack, Tooltip } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import WishlistedProduct from './WishlistedProduct';

const ProductList = ({ wishlistedProducts, handleRemoveProduct }) => {
  const methods = useForm({
    defaultValues: {
      products: [],
    },
  });
  const { control, setValue } = methods;
  const selectedProducts = useWatch({ control: control, name: 'products' });

  const { down } = useBreakpoints();
  const downSm = down('sm');
  const downMd = down('md');

  const isAllSelected = useMemo(
    () => selectedProducts.length === wishlistedProducts.length,
    [selectedProducts, wishlistedProducts],
  );

  const isIndeterminate = useMemo(
    () => selectedProducts.length > 0 && !isAllSelected,
    [selectedProducts, isAllSelected],
  );

  const handleBulkSelect = () => {
    if (isIndeterminate || !isAllSelected) {
      setValue(
        'products',
        wishlistedProducts.map((product) => product.id),
      );
    } else {
      setValue('products', []);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box
        sx={{
          bgcolor: 'background.elevation1',
          borderRadius: 6,
          py: 2,
          px: { xs: 3, md: 5 },
          mb: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <StyledTextField
            id="search-box"
            placeholder="Search for an item"
            sx={{ flex: 1, maxWidth: { sm: 276 }, order: { sm: 1 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon icon="material-symbols:search-rounded" sx={{ fontSize: 24 }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Stack
            sx={{
              gap: { xs: 1, md: 4 },
              alignItems: 'center',
            }}
          >
            <Checkbox
              sx={{ flexShrink: 0 }}
              indeterminate={isIndeterminate}
              checked={isAllSelected}
              onChange={handleBulkSelect}
            />

            <Stack
              sx={{
                flex: 1,
                gap: 1,
              }}
            >
              <Tooltip title="Add to cart">
                <span>
                  <Button
                    fullWidth={downSm}
                    variant="soft"
                    color="neutral"
                    shape={downMd ? 'square' : undefined}
                    disabled={!isAllSelected && !isIndeterminate}
                  >
                    {downMd ? (
                      <IconifyIcon
                        icon="material-symbols:add-shopping-cart-rounded"
                        fontSize={20}
                      />
                    ) : (
                      'Add to cart'
                    )}
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Compare items">
                <span>
                  <Button
                    fullWidth={downSm}
                    variant="soft"
                    color="neutral"
                    shape={downMd ? 'square' : undefined}
                    disabled={!isAllSelected && !isIndeterminate}
                  >
                    {downMd ? (
                      <IconifyIcon icon="material-symbols:compare-rounded" fontSize={20} />
                    ) : (
                      'Compare items'
                    )}
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Delete items">
                <span>
                  <Button
                    fullWidth={downSm}
                    variant="soft"
                    color="neutral"
                    shape={downMd ? 'square' : undefined}
                    disabled={!isAllSelected && !isIndeterminate}
                  >
                    {downMd ? (
                      <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
                    ) : (
                      'Delete items'
                    )}
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Stack
        direction="column"
        sx={{
          gap: 2,
        }}
      >
        {wishlistedProducts.map((product) => (
          <WishlistedProduct
            key={product.id}
            product={product}
            handleRemoveProduct={handleRemoveProduct}
          />
        ))}
      </Stack>
    </FormProvider>
  );
};

export default ProductList;
