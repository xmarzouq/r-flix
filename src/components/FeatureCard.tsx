import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';

interface FeatureCardProps {
  title: string;
  description: string;
  route: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  route,
}) => {
  const handleRedirect = () => {
    window.location.href = route;
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        m: 2,
        borderRadius: 3,
        boxShadow: 3,
        textAlign: 'center',
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleRedirect}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default FeatureCard;
