'use client';

import IconButton from "./IconButton";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <IconButton 
      size="small" 
      startIcon={<LogoutIcon />} 
      onClick={handleLogout}
    >
      Logout
    </IconButton>
  );
} 