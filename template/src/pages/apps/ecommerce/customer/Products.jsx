import { useEffect, useState } from 'react';
import { Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { defaultProductFilterOptions, products } from 'data/e-commerce/products';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import FilterDrawer from 'components/sections/ecommerce/customer/products/FilterDrawer';
import ProductTopSection from 'components/sections/ecommerce/customer/products/ProductTopSection';
import ProductsGrid from 'components/sections/ecommerce/customer/products/ProductsGrid';
import ActiveFilters from 'components/sections/ecommerce/customer/products/filter-panel/ActiveFilters';
import ProductsProvider, {
  useProducts,
} from 'components/sections/ecommerce/customer/products/providers/ProductsProvider';

const filterDrawerWidth = 320;

const index = () => (
  <ProductsProvider products={products}>
    <Products />
  </ProductsProvider>
);

const Products = () => {
  const { up } = useBreakpoints();
  const upMd = up('md');
  const [isDrawerOpen, setIsDrawerOpen] = useState(upMd ? true : false);

  const { filterItems, visibleProducts } = useProducts();

  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  useEffect(() => {
    if (upMd) {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [upMd]);

  return (
    <Grid container>
      <Grid size={12}>
        <ProductTopSection isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
      </Grid>
      <Grid size={12}>
        <Stack>
          <FilterDrawer
            handleClose={closeDrawer}
            open={isDrawerOpen}
            drawerWidth={filterDrawerWidth}
            filterOptions={defaultProductFilterOptions}
          />
          <Paper
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              marginLeft: { md: `-${filterDrawerWidth}px` },
              transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              ...(isDrawerOpen && {
                transition: theme.transitions.create('margin', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
              }),
            })}
          >
            {filterItems.length > 0 && <ActiveFilters />}
            <ProductsGrid products={visibleProducts} />
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default index;
