import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import illustrationDark from 'assets/images/illustrations/21-dark.webp';
import illustration from 'assets/images/illustrations/21.webp';
import { kebabCase } from 'lib/utils';
import { useFaqContext } from 'providers/FaqProvider';
import AnchorLinkContainer from 'components/base/AnchorLinkContainer';
import Image from 'components/base/Image';
import ScrollSpyContent from 'components/scroll-spy/ScrollSpyContent';

const FaqItems = () => {
  const { activeCategory, activeFaqItem, handleActiveItemChange } = useFaqContext();

  return (
    <Box sx={{ mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {activeCategory?.subheader}
      </Typography>

      <Box sx={{ mb: 6 }}>
        {activeCategory?.items.map((item) => {
          const isActive = activeFaqItem === item.question;

          return (
            <Box key={item.id} sx={{ mb: 5 }}>
              <ScrollSpyContent
                id={kebabCase(item.question)}
                sx={{
                  mb: 1,
                  scrollMarginTop: '424px !important',
                }}
              >
                <AnchorLinkContainer anchorSize="small" hashHref={kebabCase(item.question)}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: isActive ? 'primary.main' : 'text.primary',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleActiveItemChange(item.question)}
                  >
                    {item.question}
                  </Typography>
                </AnchorLinkContainer>
              </ScrollSpyContent>
              <Typography
                variant="body2"
                color="text.secondary"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </Box>
          );
        })}
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={2}
        sx={{
          p: 3,
          mx: 'auto',
          maxWidth: 1,
          alignItems: 'center',
          bgcolor: 'background.elevation1',
          borderRadius: 6,
        }}
      >
        <Box sx={{ p: 5 }}>
          <Image src={{ light: illustration, dark: illustrationDark }} sx={{ width: 56 }} />
        </Box>
        <div>
          <Typography variant="h6" sx={{ mb: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            Haven’t found the answer you were looking for?
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 3, color: 'text.secondary', textAlign: { xs: 'center', sm: 'left' } }}
          >
            Feel free to message us, or give us a call
          </Typography>
          <Button variant="contained" sx={{ width: { xs: 1, sm: 'auto' } }}>
            Contact us
          </Button>
        </div>
      </Stack>
    </Box>
  );
};

export default FaqItems;
