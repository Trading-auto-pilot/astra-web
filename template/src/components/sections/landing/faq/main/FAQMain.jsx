import { useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { Box, Container } from '@mui/material';
import { faqCategories } from 'data/landing/faqs';
import { gsap } from 'gsap';
import Categories from './Categories';
import SelectedCategory from './SelectedCategory';

gsap.registerPlugin(useGSAP);

const FAQMain = () => {
  const [categoryType, setCategoryType] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('');

  const gridRef = useRef(null);
  const tabsRef = useRef(null);
  const selectedCategoryRef = useRef(null);
  const accordionListRef = useRef(null);

  const displayedCategories =
    categoryType === 'popular' ? faqCategories.filter((c) => c.isPopular) : faqCategories;

  const animateElements = (elements, props, onComplete) => {
    if (!elements) return;
    gsap.to(elements, { ...props, onComplete });
  };

  const handleTabChange = (_, newValue) => {
    if (newValue === categoryType) return;

    animateElements(
      gridRef.current?.children || null,
      { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.inOut', stagger: 0.01 },
      () => {
        setCategoryType(newValue);
      },
    );
  };

  const handleCategory = (categoryId) => {
    animateElements(
      gridRef.current?.children || null,
      { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in', stagger: 0.02 },
      () => setSelectedCategory(categoryId),
    );

    animateElements(tabsRef.current, { opacity: 0, y: -15, duration: 0.25, ease: 'power2.in' });
  };

  const handleResetCategory = () => {
    const backButton = selectedCategoryRef.current?.querySelector('button');
    if (backButton) {
      animateElements(backButton, { opacity: 0, x: -10, duration: 0.2, ease: 'power2.in' });
    }

    animateElements(
      accordionListRef.current?.children || null,
      { opacity: 0, y: 10, duration: 0.25, ease: 'power2.in', stagger: 0.02 },
      () => setSelectedCategory(''),
    );
  };

  useGSAP(() => {
    if (!selectedCategory && gridRef.current?.children) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out', stagger: 0.03 },
      );
    }
  }, [categoryType, selectedCategory]);

  useLayoutEffect(() => {
    if (selectedCategory && selectedCategoryRef.current) {
      gsap.fromTo(
        selectedCategoryRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
      );

      const accordionChildren = accordionListRef.current?.children;
      if (accordionChildren) {
        gsap.fromTo(
          accordionChildren,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.05, delay: 0.2 },
        );
      }
    }
  }, [selectedCategory]);

  return (
    <Box sx={{ px: { xs: 3, md: 5 } }}>
      <Container maxWidth={false} sx={{ maxWidth: 1000, px: 0, pt: 2, pb: 4 }}>
        {selectedCategory ? (
          <SelectedCategory
            selectedCategory={faqCategories.find((cat) => cat.id === selectedCategory)}
            handleResetCategory={handleResetCategory}
            selectedCategoryRef={selectedCategoryRef}
            accordionListRef={accordionListRef}
          />
        ) : (
          <Categories
            categoryType={categoryType}
            handleTabChange={handleTabChange}
            displayedCategories={displayedCategories}
            handleCategory={handleCategory}
            tabsRef={tabsRef}
            gridRef={gridRef}
          />
        )}
      </Container>
    </Box>
  );
};

export default FAQMain;
