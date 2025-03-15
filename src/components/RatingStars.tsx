'use client';
import React, { useState } from 'react';
import { Rating, Box, Typography } from '@mui/material';

interface RatingStarsProps {
  initialRating: number;
  onRate: (newRating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({ initialRating, onRate }) => {
  const [value, setValue] = useState<number | null>(initialRating);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setValue(newValue);
    if (newValue !== null) {
      onRate(newValue);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Rating value={value} onChange={handleChange} precision={0.5} />
      {value && (
        <Typography variant="body2" sx={{ ml: 1 }}>
          {value === 1
            ? 'Awful!'
            : value === 2
            ? 'Meh'
            : value === 3
            ? 'Nice'
            : value === 4
            ? 'Great'
            : 'Epic!'}
        </Typography>
      )}
    </Box>
  );
};

export default RatingStars;
