import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productInventoryFormSchema } from './steps/Inventory';
import { mediaFilesFormSchema } from './steps/MediaFiles';
import { nameDescriptionFormSchema } from './steps/NameDescription';
import { productPricingSchema } from './steps/PricingQuantity';
import { ShippingFormSchema } from './steps/Shipping';
import { productInfoFormSchema } from './steps/product-information/ProductInfo';
import { productVariantSchema } from './steps/variations/ProductVariants';
import { vitalInfoFormSchema } from './steps/vital-info/VitalInfo';

const productListingFormSchema = [
  vitalInfoFormSchema,
  nameDescriptionFormSchema,
  productInfoFormSchema,
  mediaFilesFormSchema,
  productVariantSchema,
  productPricingSchema,
  productInventoryFormSchema,
  ShippingFormSchema,
  null,
];

const getCombineVariants = (variants) => {
  const items = variants.map((variant) => variant.items);
  const combinedItems = items.flatMap((arr, index) => {
    return arr.flatMap((item) =>
      items.length > 1
        ? items
            .slice(index + 1)
            .flatMap((nextArr) => nextArr.map((nextItem) => `${item.value}/${nextItem.value}`))
        : item.value,
    );
  });

  return combinedItems;
};

const useProductListingForm = (activeStep) => {
  const methods = useForm({
    //@ts-ignore
    resolver: productListingFormSchema[activeStep]
      ? //@ts-ignore
        yupResolver(productListingFormSchema[activeStep])
      : undefined,
    defaultValues: {
      images: [],
      variants: [],
    },
  });

  const { control, setValue } = methods;

  const [variants, name] = useWatch({
    control,
    name: ['variants', 'name'],
  });

  useEffect(() => {
    if (variants && variants.length > 0) {
      const combinedVariants = getCombineVariants(variants);
      setValue('combinedVariants', combinedVariants);
    } else {
      if (name) {
        setValue('combinedVariants', [name]);
      } else {
        setValue('combinedVariants', ['N/A']);
      }
    }
  }, [variants, name]);

  return methods;
};

export default useProductListingForm;
