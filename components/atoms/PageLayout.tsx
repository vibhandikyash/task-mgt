import { Box } from '@mui/material';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => (
  <Box sx={{ p: 3, bgcolor: '#1E1F21', minHeight: '100vh' }}>
    {children}
  </Box>
);

export default PageLayout; 