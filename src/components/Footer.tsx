'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © 2025 R-flix. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
