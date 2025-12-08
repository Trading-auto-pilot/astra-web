import { createContext, use, useState } from 'react';

export const OrderDetailsContext = createContext({});

const OrderDetailsProvider = ({ children }) => {
  const [selectedOrder, setSetselectedOrder] = useState(null);

  return (
    <OrderDetailsContext
      value={{
        order: selectedOrder,
        setSetselectedOrder,
      }}
    >
      {children}
    </OrderDetailsContext>
  );
};

export const useOrderDetails = () => use(OrderDetailsContext);

export default OrderDetailsProvider;
