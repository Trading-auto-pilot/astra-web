import { Divider, Stack, Typography } from '@mui/material';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import PaymentMethodsSection from './PaymentMethodsSection';

const CreditCardInfoTabPanel = () => {
  return (
    <Stack direction="column" divider={<Divider />} spacing={5}>
      <AccountTabPanelSection
        title="Payment Method"
        subtitle="Update your payment methods. Add credit cards, and securely save multiple payment methods for fast and convenient transactions."
        icon="material-symbols:payments-outline"
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
          Credit cards
        </Typography>
        <PaymentMethodsSection />
      </AccountTabPanelSection>
    </Stack>
  );
};

export default CreditCardInfoTabPanel;
