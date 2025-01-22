import { Box, Button, Link, MenuItem } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import AuthTextField from "../atoms/AuthTextField";
import StyledSelect from "../atoms/StyledSelect";
import { UserRole, USER_ROLES } from "@/types/auth";
import { signUpUser } from "@/lib/api";

const SignupForm = () => {
  const router = useRouter();
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUpUser(client, formData);
      router.push('/login');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Box sx={{ color: 'error.main', mb: 2, textAlign: 'center' }}>
          {error}
        </Box>
      )}
      <AuthTextField
        margin="normal"
        required
        fullWidth
        label="Name"
        name="name"
        autoFocus
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        disabled={loading}
      />
      <AuthTextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        name="email"
        autoComplete="email"
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
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        disabled={loading}
      />
      <StyledSelect
        label="Role"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
        required
        fullWidth
        sx={{ mt: 2, mb: 1 }}
        disabled={loading}
      >
        {USER_ROLES.map((role) => (
          <MenuItem key={role} value={role}>
            {role.charAt(0) + role.slice(1).toLowerCase()}
          </MenuItem>
        ))}
      </StyledSelect>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </Button>
      <Box textAlign="center">
        <Link 
          href="/login" 
          variant="body2"
          sx={{ 
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Already have an account? Sign in
        </Link>
      </Box>
    </Box>
  );
};

export default SignupForm; 