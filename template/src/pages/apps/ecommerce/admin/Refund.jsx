import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { orderDetailsList } from 'data/e-commerce/orders';
import paths from 'routes/paths';
import * as yup from 'yup';
import PageHeader from 'components/sections/ecommerce/admin/common/PageHeader';
import OrderDetailsProvider, {
  useOrderDetails,
} from 'components/sections/ecommerce/admin/order/OrderDetailsProvider';
import RefundAside from 'components/sections/ecommerce/admin/refund/aside';
import RefundContainer from 'components/sections/ecommerce/admin/refund/main';

export const refundFormValuesSchema = yup.object({
  note: yup.string(),
  refunds: yup
    .array()
    .of(
      yup.object({
        product: yup.number().min(0, 'Value must be a positive number').required(),
        shipping: yup.number().min(0, 'Value must be a positive number').required(),
        concession: yup.number().min(0, 'Value must be a positive number').required(),
      }),
    )
    .required(),
});

const index = () => {
  return (
    <OrderDetailsProvider>
      <Refund />
    </OrderDetailsProvider>
  );
};

const Refund = () => {
  const { order, setSetselectedOrder } = useOrderDetails();

  const methods = useForm({
    resolver: yupResolver(refundFormValuesSchema),
  });

  useEffect(() => {
    setSetselectedOrder(orderDetailsList[0]);
  }, []);

  if (!order) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <Grid container>
        <Grid
          size={{
            xs: 12,
            md: 8,
            xl: 9,
          }}
        >
          <Stack direction="column">
            <PageHeader
              title={`Refund Order ${order.id}`}
              breadcrumb={[
                { label: 'Order list', url: paths.orderList },
                { label: 'Refund', active: true },
              ]}
              actionComponent={
                <Button variant="soft" color="neutral" sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                  Edit refunds settings
                </Button>
              }
            />

            <RefundContainer />
          </Stack>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4,
            xl: 3,
          }}
        >
          <RefundAside />
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default index;
