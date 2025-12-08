import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export const ProductsContext = createContext({});

const ProductsProvider = ({ children, products }) => {
  const [visibleProducts, setVisibleProducts] = useState(products);
  const methods = useForm();
  const { setValue, getValues, reset, watch, handleSubmit } = methods;
  const formValues = getValues();

  const filterItems = useMemo(() => {
    return Object.keys(formValues).reduce((acc, key) => {
      if (key !== 'priceRange') {
        formValues[key].forEach((element) => {
          acc.push({
            value: element,
            filter: key,
          });
        });
      }

      return acc;
    }, []);
  }, [formValues]);

  const handleDeleteFilterItem = useCallback(
    (item) => {
      setValue(
        item.filter,
        formValues[item.filter].filter((value) => value !== item.value),
      );
    },
    [formValues],
  );

  const handleProductsSort = useCallback(
    (sortBy) => {
      switch (sortBy) {
        case 'recommended':
          onSubmit(formValues);
          break;
        case 'lowToHight':
          setVisibleProducts((prev) =>
            [...prev].sort((a, b) => a.price.discounted - b.price.discounted),
          );
          break;
        case 'highToLow':
          setVisibleProducts((prev) =>
            [...prev].sort((a, b) => b.price.discounted - a.price.discounted),
          );
          break;
        case 'highestRated':
          setVisibleProducts((prev) => [...prev].sort((a, b) => b.ratings - a.ratings));
          break;
        default:
          onSubmit(formValues);
      }
    },
    [formValues],
  );

  const handleResetFilters = useCallback(() => {
    reset();
  }, []);

  const onSubmit = (data) => {
    const filteredProducts = products.filter((product) => {
      return Object.keys(data).every((key) => {
        if (data[key].length === 0) {
          return true;
        }
        if (key === 'priceRange') {
          const [min, max] = data[key];

          return product.price.discounted >= min && product.price.discounted <= max;
        } else {
          const productValues = product[key];

          return productValues.some((value) => data[key].includes(value));
        }
      });
    });

    setVisibleProducts(filteredProducts);
  };

  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit));

    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <ProductsContext
      value={{
        filterItems,
        visibleProducts,
        handleDeleteFilterItem,
        handleResetFilters,
        handleProductsSort,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </ProductsContext>
  );
};

export const useProducts = () => use(ProductsContext);

export default ProductsProvider;
