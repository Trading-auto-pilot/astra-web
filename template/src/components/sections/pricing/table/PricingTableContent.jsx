import React from 'react';
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  tableCellClasses,
  tableHeadClasses,
} from '@mui/material';
import { pricing } from 'data/pricing';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import PricingPlanCard from 'components/sections/pricing/table/PricingPlanCard';

const getFeatureActiveState = (pricingItem, category, feature) => {
  const categoryInPlan = pricingItem.tableFeatures?.find(
    (cat) => cat.category === category.category,
  );
  const featureInPlan = categoryInPlan?.features.find((item) => item.id === feature.id);

  return featureInPlan ? featureInPlan.active : false;
};

const PricingTableContent = ({ isYearly }) => {
  const { down } = useBreakpoints();
  const downXl = down('xl');
  const { topbarHeight } = useNavContext();

  return (
    <>
      {downXl && (
        <Stack
          direction="column"
          spacing={3}
          sx={{ p: { xs: 3, md: 5 }, backgroundColor: 'background.elevation2' }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Not sure which plan is for you?
          </Typography>
          <Typography variant="body2">
            Take our short and engaging quiz to save the guesswork and personalize our
            recommendations just for you.
          </Typography>
          <Button color="neutral" variant="contained" sx={{ alignSelf: 'start' }}>
            Take a test
          </Button>
        </Stack>
      )}

      <TableContainer sx={{ width: 1, overflowX: 'initial', borderRadius: 0 }}>
        <Table
          stickyHeader
          padding="none"
          sx={{
            tableLayout: 'fixed',
            borderCollapse: 'separate',
            borderSpacing: 2,
            mx: '-2px',
            [`& .${tableHeadClasses.root}`]: {
              th: { p: 0 },
            },
          }}
        >
          <TableHead
            sx={(theme) => ({
              '& th': {
                outline: `2px solid ${theme.vars.palette.background.paper}`,
                position: 'sticky',
                top: topbarHeight,
                backgroundColor: 'background.elevation1',
                zIndex: 2,
              },
            })}
          >
            <TableRow>
              {!downXl && (
                <TableCell
                  variant="head"
                  sx={{
                    minWidth: 280,
                    '&:first-of-type': { p: { xs: '24px !important', md: '40px !important' } },
                    [`&.${tableCellClasses.head}`]: {
                      backgroundColor: 'background.elevation2',
                    },
                  }}
                >
                  <Stack direction="column" spacing={3}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Not sure which plan is for you?
                    </Typography>
                    <Typography variant="body2">
                      Take our short and engaging quiz to save the guesswork and personalize our
                      recommendations just for you.
                    </Typography>
                    <Button color="neutral" variant="contained" sx={{ alignSelf: 'start' }}>
                      Take a test
                    </Button>
                  </Stack>
                </TableCell>
              )}
              {pricing.map((plan) => (
                <TableCell
                  key={plan.tableTitle}
                  align="center"
                  sx={{
                    verticalAlign: 'bottom',
                    px: '0px !important',
                    minWidth: 92,
                    width: { xs: '25%', xl: '20%' },
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <PricingPlanCard isYearly={isYearly} {...plan} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {pricing[0].tableFeatures?.map((category) => (
              <React.Fragment key={category.category}>
                <TableRow
                  sx={{
                    '& th, & td': { border: 0, color: 'text.disabled' },
                  }}
                >
                  <TableCell colSpan={pricing.length + 1} align="center" sx={{ py: 2 }}>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{
                        display: 'inline-block',
                        color: 'text.primary',
                      }}
                    >
                      {category.category}
                    </Typography>
                  </TableCell>
                </TableRow>

                {category.features.map((feature) => (
                  <React.Fragment key={feature.id}>
                    {downXl && (
                      <TableRow>
                        <TableCell
                          align="center"
                          colSpan={pricing.length + 1}
                          sx={{
                            backgroundColor: 'background.elevation2',
                            fontWeight: 700,
                            px: { xs: '24px !important', md: '40px !important' },
                            py: 2,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" fontWeight={700}>
                            {feature.title}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow
                      sx={{
                        height: { xs: 48, md: 54 },
                        bgcolor: 'background.elevation1',
                        '& th, & td': { border: 0, color: 'text.disabled' },
                      }}
                    >
                      {!downXl && (
                        <TableCell
                          sx={{
                            backgroundColor: 'background.elevation2',
                            fontWeight: 700,
                            px: { xs: '24px !important', md: '40px !important' },
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" fontWeight={700}>
                            {feature.title}
                          </Typography>
                        </TableCell>
                      )}

                      {pricing.map((pricingItem) => {
                        const isActive = getFeatureActiveState(pricingItem, category, feature);

                        return (
                          <TableCell
                            key={pricingItem.id}
                            align="center"
                            sx={{ px: '0px !important' }}
                          >
                            <IconifyIcon
                              color={isActive ? 'success.main' : 'text.disabled'}
                              icon={
                                isActive
                                  ? 'material-symbols:check-circle-outline-rounded'
                                  : 'material-symbols:cancel-outline'
                              }
                              sx={{ fontSize: 20 }}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PricingTableContent;
