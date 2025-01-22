import { Box, Button, Link, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthTextField from "../atoms/AuthTextField";
import { signInUser } from "@/lib/api";
import { useApolloClient } from "@apollo/client";
import { NormalizedCacheObject } from "@apollo/client";

const LoginForm = () => {
  const router = useRouter();
  const client = useApolloClient<NormalizedCacheObject>();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const authPayload = await signInUser(client, formData);
      localStorage.setItem('token', authPayload.token); 
      router.push('/'); 
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <AuthTextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        disabled={loading}
      />
      <AuthTextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        disabled={loading}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
      <Box textAlign="center">
        <Link 
          href="/signup" 
          variant="body2"
          sx={{ 
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {"Don't have an account? Sign up"}
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm; 