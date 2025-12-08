import { useCallback, useState } from 'react';
import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import illustrationDark from 'assets/images/illustrations/1-dark.webp';
import illustration from 'assets/images/illustrations/1.webp';
import { wishlistedProducts } from 'data/e-commerce/products';
import paths from 'routes/paths';
import Image from 'components/base/Image';
import PageHeader from 'components/sections/ecommerce/customer/common/PageHeader';
import Productlist from 'components/sections/ecommerce/customer/wishlist/ProductList';
import WishlistActions from 'components/sections/ecommerce/customer/wishlist/WishlistActions';

const Wishlist = () => {
  const [products, setProducts] = useState(wishlistedProducts);

  const handleRemoveProduct = useCallback((productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }, []);

  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader
          title="Wishlist"
          userLoggedIn
          breadcrumb={[
            { label: 'Home', url: paths.ecommerceHomepage },
            { label: 'Wishlist', active: true },
          ]}
        />
      </Grid>
      <Grid size={12}>
        <Paper sx={{ height: 1, px: { xs: 3, md: 5 }, py: { xs: 5, md: 8 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 0 } }}>
            <WishlistActions />

            {products.length > 0 ? (
              <Productlist
                wishlistedProducts={products}
                handleRemoveProduct={handleRemoveProduct}
              />
            ) : (
              <Stack
                direction="column"
                sx={{
                  height: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 3,
                  textAlign: 'center',
                  p: 5,
                }}
              >
                <Image
                  src={{
                    light: illustration,
                    dark: illustrationDark,
                  }}
                  alt="Products Fallback"
                  height={340}
                  width={340}
                />
                <div>
                  <Typography variant="h6" mb={1}>
                    Your wishlist is empty
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={3}>
                    Browse our products and add your favorite items to your wishlist.
                  </Typography>
                  <Button variant="contained" color="primary" href={paths.products}>
                    Browse Products
                  </Button>
                </div>
              </Stack>
            )}
          </Container>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Wishlist;
