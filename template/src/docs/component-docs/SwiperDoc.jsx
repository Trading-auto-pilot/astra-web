import { initialConfig } from 'config';
import { products } from 'data/e-commerce/products';
import { folderBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import paths from 'routes/paths';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import Image from 'components/base/Image';
import Swiper from 'components/base/Swiper';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const gallery = (index) => `${initialConfig.assetsDir}/images/ecommerce/gallery/${index}.webp`;

const basicSwiperCode = `import Swiper from 'components/base/Swiper';

const SwiperBasic = () => {
  return (
    <Swiper sx={{ '& .swiper': { borderRadius: 4 } }} loop={true} navigation={true} slidesPerView={1} autoplay={true} modules={[Autoplay, Navigation]}>
      <SwiperSlide>
        <Box
          sx={{
            width: 1,
            height: { xs: 300, lg: 500},
            borderRadius: 4,
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Image
            src="${gallery(1)}"
            alt="slide-1"
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
            }}
          />
        </Box>
      </SwiperSlide>
      <SwiperSlide>
        <Box
          sx={{
            width: 1,
            height: { xs: 300, lg: 500},
            borderRadius: 4,
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Image
            src="${gallery(2)}"
            alt="slide-2"
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
            }}
          />
        </Box>
      </SwiperSlide>
      <SwiperSlide>
        <Box
          sx={{
            width: 1,
            height: { xs: 300, lg: 500},
            borderRadius: 4,
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Image
            src="${gallery(3)}"
            alt="slide-3"
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
            }}
          />
        </Box>
      </SwiperSlide>
    </Swiper>
  )
};

render(<SwiperBasic />)`.trim();

const swiperWithThumbnailCode = `import Swiper from 'components/base/Swiper';

const SwiperWithThumbs = () => {
const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <>
      <Swiper 
        sx={{ mb: 2, '& .swiper': { borderRadius: 4 } }} 
        loop={true} 
        slidesPerView={1} 
        thumbs={{
          swiper:
            thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
        }}
        navigation={true}
        autoplay={true}
        modules={[FreeMode, Thumbs, Autoplay, Navigation]}
      >
        <SwiperSlide>
          <Box
            sx={{
              width: 1,
              height: { xs: 300, lg: 500},
              borderRadius: 4,
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Image
              src="${gallery(1)}"
              alt="slide-1"
              sx={{
                width: 1,
                height: 1,
                objectFit: 'cover',
              }}
            />
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box
            sx={{
              width: 1,
              height: { xs: 300, lg: 500},
              borderRadius: 4,
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Image
              src="${gallery(2)}"
              alt="slide-2"
              sx={{
                width: 1,
                height: 1,
                objectFit: 'cover',
              }}
            />
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box
            sx={{
              width: 1,
              height: { xs: 300, lg: 500},
              borderRadius: 4,
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Image
              src="${gallery(3)}"
              alt="slide-3"
              sx={{
                width: 1,
                height: 1,
                objectFit: 'cover',
              }}
            />
          </Box>
        </SwiperSlide>
      </Swiper>

      <Swiper
        onInit={setThumbsSwiper}
        spaceBetween={8}
        slidesPerView="auto"
        freeMode={true}
        navigation={false}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        sx={{
          '& .swiper': {
            '& .swiper-wrapper': {
              justifyContent: 'center',
              '.swiper-slide': {
                width: 'auto',
                height: 'auto',
              },
            },
          }
        }}
      >
        <SwiperSlide>
          <Box
            sx={{
              flexShrink: 0,
              cursor: 'pointer',
              width: 80,
              height: 80,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.elevation1',
              border: '2px solid transparent',
              '.swiper-slide-thumb-active &': {
                borderColor: 'primary.main',
              },
            }}
          >
            <Image
              src="${gallery(1)}"
              alt=""
              sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
            />
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box
            sx={{
              flexShrink: 0,
              cursor: 'pointer',
              width: 80,
              height: 80,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.elevation1',
              border: '2px solid transparent',
              '.swiper-slide-thumb-active &': {
                borderColor: 'primary.main',
              },
            }}
          >
            <Image
              src="${gallery(2)}"
              alt=""
              sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
            />
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box
            sx={{
              flexShrink: 0,
              cursor: 'pointer',
              width: 80,
              height: 80,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.elevation1',
              border: '2px solid transparent',
              '.swiper-slide-thumb-active &': {
                borderColor: 'primary.main',
              },
            }}
          >
            <Image
              src="${gallery(3)}"
              alt=""
              sx={{ width: 1, height:1, objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
            />
          </Box>
        </SwiperSlide>
      </Swiper>
    </>
  ) 
};

render(<SwiperWithThumbs />)`.trim();

const customNavigationSwiperCode = `import Swiper from 'components/base/Swiper';

const SwiperWithCustomNavigation = () => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  return (
    <>
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: { xs: 3, md: 2 },
        }}
      >
        <Typography variant="h6">Suggested Products</Typography>
        <Stack
          sx={{
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Button
            ref={navigationPrevRef}
            color="neutral"
            variant="soft"
            sx={{ p: 1, minWidth: 0, flexShrink: 0 }}
          >
            <IconifyIcon icon="material-symbols:chevron-left-rounded" sx={{ fontSize: 20 }} />
          </Button>
          <Button
            ref={navigationNextRef}
            color="neutral"
            variant="soft"
            sx={{ p: 1, minWidth: 0, flexShrink: 0 }}
          >
            <IconifyIcon icon="material-symbols:chevron-right-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Stack>
      </Stack>
      <Swiper
        slidesPerView="auto"
        loop={true}
        spaceBetween={8}
        navigation={{
          prevEl: navigationPrevRef,
          nextEl: navigationNextRef,
        }}
        sx={{
          '& .swiper-slide': {
            width: 'auto',
            height: 'auto',
            boxSizing: 'border-box',
          },
        }}
      >
        {products.map(({ id, name, images }) => (
          <SwiperSlide key={id}>
            <Link
              href={paths.productDetails(String(id))}
              underline="none"
              sx={{
                width: 200,
                height: 200,
                bgcolor: 'background.elevation1',
                borderRadius: 6,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'background.elevation2',
                },
              }}
            >
              <Image
                src={images[0].src}
                alt={kebabCase(name)}
                width={160}
                sx={{ objectFit: 'contain', pointerEvents: 'none' }}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
};

render(<SwiperWithCustomNavigation />)`.trim();

const SwiperDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Swiper',
        description:
          'Swiper is the most modern free and open source mobile touch slider with hardware accelerated transitions and amazing native behavior. Use it on websites, web apps, and mobile native/hybrid apps.',

        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Swiper',
          },
        ],
        folderLink: `${folderBaseLink}/SwiperDoc.jsx`,
        docLink: 'https://swiperjs.com/react',
        docLinkLabel: 'Swiper Docs',
      }}
    >
      <DocSection title="Basic">
        <DocCard
          code={basicSwiperCode}
          noInline
          scope={{
            Swiper,
            SwiperSlide,
            Autoplay,
            Navigation,
            Image,
            gallery,
          }}
        />
      </DocSection>

      <DocSection title="Thumbs">
        <DocCard
          code={swiperWithThumbnailCode}
          noInline
          scope={{
            Swiper,
            SwiperSlide,
            Navigation,
            Autoplay,
            FreeMode,
            Thumbs,
            Image,
            gallery,
          }}
        />
      </DocSection>

      <DocSection title="Custom Navigation">
        <DocCard
          code={customNavigationSwiperCode}
          noInline
          scope={{
            Swiper,
            SwiperSlide,
            Image,
            products,
            paths,
            kebabCase,
          }}
        />
      </DocSection>
    </DocPageLayout>
  );
};

export default SwiperDoc;
