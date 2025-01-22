import { Box, Container, Typography } from "@mui/material";

interface AuthFormContainerProps {
  title: string;
  children: React.ReactNode;
}

const AuthFormContainer = ({ title, children }: AuthFormContainerProps) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#1E1F21'
    }}
  >
    <Container maxWidth="sm">
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          bgcolor: '#2C2C2C',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography component="h1" variant="h5" color="white" textAlign="center" mb={3}>
          {title}
        </Typography>
        {children}
      </Box>
    </Container>
  </Box>
);

export default AuthFormContainer; 