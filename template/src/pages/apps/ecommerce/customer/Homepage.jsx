import { categoryBanners, features, popularCategories } from 'data/e-commerce/homepage';
import { products } from 'data/e-commerce/products';
import CategoryBanners from 'components/sections/ecommerce/customer/homepage/CategoryBanners';
import FeaturedProducts from 'components/sections/ecommerce/customer/homepage/FeaturedProducts';
import Features from 'components/sections/ecommerce/customer/homepage/Features';
import HeroSlider from 'components/sections/ecommerce/customer/homepage/HeroSlider';
import MostViewedProducts from 'components/sections/ecommerce/customer/homepage/MostViewedProducts';
import PopularCategories from 'components/sections/ecommerce/customer/homepage/PopularCategories';
import PromoAlert from 'components/sections/ecommerce/customer/homepage/PromoAlert';
import SupportFAQ from 'components/sections/ecommerce/customer/homepage/SupportFAQ';

const EcommerceHomepage = () => {
  return (
    <>
      <PromoAlert />
      <HeroSlider />
      <Features features={features} />
      <PopularCategories categories={popularCategories} />
      <CategoryBanners banners={categoryBanners} />
      <MostViewedProducts products={products} />
      <FeaturedProducts products={products} />
      <SupportFAQ />
    </>
  );
};

export default EcommerceHomepage;
