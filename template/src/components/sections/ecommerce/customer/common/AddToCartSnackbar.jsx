import { Alert, Snackbar } from '@mui/material';

const AddToCartSnackbar = ({ open, handleClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ borderRadius: 7, boxShadow: (theme) => theme.vars.shadows[3] }}
      >
        Added to the cart successfully!
      </Alert>
    </Snackbar>
  );
};

export default AddToCartSnackbar;
