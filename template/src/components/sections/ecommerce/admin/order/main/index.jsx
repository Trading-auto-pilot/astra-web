import OrderItems from './OrderItems';
import OrderPaymentSummary from './OrderPaymentSummary';
import OrderTimeline from './OrderTimeline';

const OrderContainer = () => {
  return (
    <>
      <OrderItems />
      <OrderPaymentSummary />
      <OrderTimeline />
    </>
  );
};

export default OrderContainer;
