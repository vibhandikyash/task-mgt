import { Box, Typography, Button } from '@mui/material';

interface ErrorMessageProps {
  message: string;
  error: Error;
  onRetry: () => void;
}

const ErrorMessage = ({ message, error, onRetry }: ErrorMessageProps) => (
  <Box
    sx={{
      textAlign: 'center',
      p: 3,
      color: 'error.main'
    }}
  >
    <Typography variant="h6" gutterBottom>
      {message}
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      {error.message}
    </Typography>
    <Button 
      variant="contained" 
      color="primary" 
      onClick={onRetry}
    >
      Try Again
    </Button>
  </Box>
);

export default ErrorMessage; 