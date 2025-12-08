import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import { ecomCoupons, products } from 'data/e-commerce/products';
import { useSnackbar } from 'notistack';

export const EcommerceContext = createContext({});

const initialCartItems = products
  .slice(0, 2)
  .map((product) => ({ ...product, quantity: 1, selected: true }));

const EcommerceProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [appliedCoupon, setAppliedCoupon] = useState(ecomCoupons[0]);

  const addItemToCart = useCallback(
    (product) => {
      const existingItem = cartItems.find((item) => item.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      if (existingItem) {
        setCartItems((prev) =>
          prev.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item)),
        );
      } else {
        setCartItems((prev) => [...prev, { ...product, quantity: newQuantity, selected: true }]);
      }
      enqueueSnackbar('Added to the cart successfully!', { variant: 'success' });
    },
    [cartItems],
  );

  const removeItemFromCart = useCallback(
    (productId) => {
      setCartItems(cartItems.filter((item) => item.id !== productId));
    },
    [cartItems],
  );

  const updateCartItem = useCallback(
    (itemId, updatedData) => {
      const updatedItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, ...updatedData } : item,
      );
      setCartItems(updatedItems);
    },
    [cartItems],
  );

  const cartSubTotal = useMemo(
    () =>
      cartItems
        .filter((item) => item.selected)
        .reduce((acc, item) => {
          acc += item.price.discounted * item.quantity;

          return acc;
        }, 0),
    [cartItems],
  );

  const cartTotal = useMemo(() => {
    return cartSubTotal - (appliedCoupon?.appliedDiscount || 0);
  }, [cartSubTotal, appliedCoupon]);

  useEffect(() => {
    setAppliedCoupon((prevCoupon) =>
      prevCoupon
        ? {
            ...prevCoupon,
            appliedDiscount:
              (appliedCoupon?.appliedDiscount || 0) > cartSubTotal ? 0 : prevCoupon.discount,
          }
        : prevCoupon,
    );
  }, [cartSubTotal]);

  return (
    <EcommerceContext
      value={{
        product,
        setProduct,
        cartItems,
        setCartItems,
        addItemToCart,
        removeItemFromCart,
        updateCartItem,
        appliedCoupon,
        setAppliedCoupon,
        cartSubTotal,
        cartTotal,
      }}
    >
      {children}
    </EcommerceContext>
  );
};

export const useEcommerce = () => use(EcommerceContext);

export default EcommerceProvider;
