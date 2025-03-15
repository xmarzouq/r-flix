import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const SignIn: React.FC = () => {
  //   const router = useRouter();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Welcome to R-flix
      </Typography>
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 10,
          p: 3,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          You need to sign in to access this page.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            window.location.href = '/signin';
          }}
        >
          Sign In
        </Button>
      </Box>
    </>
  );
};

export default SignIn;
