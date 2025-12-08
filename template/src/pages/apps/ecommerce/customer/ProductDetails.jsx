import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  featuredProducts,
  productColorVariants,
  suggestedProducts,
} from 'data/e-commerce/products';
import { useEcommerce } from 'providers/EcommerceProvider';
import paths from 'routes/paths';
import { useGetProduct } from 'services/swr/api-hooks/useProductApi';
import SuggestedProducts from 'components/sections/ecommerce/customer/common/SuggestedProducts';
import GeneralInfo from 'components/sections/ecommerce/customer/product-details/GeneralInfo';
import PricingBottomBar from 'components/sections/ecommerce/customer/product-details/PricingBottomBar';
import ProductDetailsAside from 'components/sections/ecommerce/customer/product-details/aside';
import FrequentProducts from 'components/sections/ecommerce/customer/product-details/aside/FrequentProducts';
import ProductGallery from 'components/sections/ecommerce/customer/product-details/gallery';
import ProductInformation from 'components/sections/ecommerce/customer/product-details/information';

const ProductDetails = () => {
  const { id } = useParams();

  const { setProduct, product } = useEcommerce();

  useGetProduct(id || '1', {
    onSuccess: (data) => {
      if (data) {
        setProduct({ ...data, quantity: 1, selected: false });
      }
    },
  });

  const [selectedVariantKey, setSelectedVariantKey] = useState('satin-linen');

  const selectedVariant = useMemo(() => {
    return productColorVariants.find((variant) => variant.id === selectedVariantKey);
  }, [selectedVariantKey]);

  const handleSelectedVariantKey = (value) => setSelectedVariantKey(value);

  if (!product) {
    return <Navigate to={paths[404]} />;
  }

  return (
    <Grid container>
      <Grid
        size={{
          xs: 12,
          lg: 8,
        }}
      >
        <Paper
          sx={(theme) => ({
            position: 'sticky',
            height: { lg: `calc(100vh - ${theme.mixins.ecommerceTopbar.md}px - 58px)` },
            top: theme.mixins.ecommerceTopbar,
            p: { xs: 3, md: 5 },
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
          })}
        >
          <GeneralInfo sx={{ mb: 5 }} />
          {selectedVariant && <ProductGallery images={selectedVariant.images} />}
        </Paper>
      </Grid>
      <Grid
        size={{
          xs: 12,
          lg: 4,
        }}
      >
        <ProductDetailsAside
          selectedVariantKey={selectedVariantKey}
          handleSelectedVariantKey={handleSelectedVariantKey}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          lg: 8,
        }}
      >
        <ProductInformation />
      </Grid>
      <Grid
        size={{
          xs: 12,
          lg: 4,
        }}
      >
        <Box
          sx={(theme) => ({
            position: 'sticky',
            top: theme.mixins.ecommerceTopbar,
            p: { xs: 3, md: 5 },
          })}
        >
          <FrequentProducts frequentProducts={featuredProducts} />
        </Box>
      </Grid>
      <Grid sx={{ position: 'sticky', zIndex: 999, width: 1, bottom: 0 }} size={12}>
        <PricingBottomBar />
      </Grid>
      <Grid size={12}>
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <SuggestedProducts products={suggestedProducts} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
