import { TextField, TextFieldProps } from "@mui/material";

const AuthTextField = (props: TextFieldProps) => (
  <TextField
    {...props}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
      },
      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
      '& .MuiOutlinedInput-input': { color: 'white' },
      ...props.sx
    }}
  />
);

export default AuthTextField; 