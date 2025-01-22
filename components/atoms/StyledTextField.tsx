import { TextField, TextFieldProps } from "@mui/material";

const StyledTextField = (props: TextFieldProps) => (
  <TextField
    {...props}
    sx={{
      mb: 3,
      mt: 2,
      "& .MuiOutlinedInput-root": {
        color: "white",
        backgroundColor: "rgba(255,255,255,0.05)",
        "& fieldset": {
          borderColor: "rgba(255,255,255,0.1)",
        },
        "&:hover fieldset": {
          borderColor: "rgba(255,255,255,0.2)",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#0052CC",
        },
      },
      "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.7)",
      },
      ...props.sx,
    }}
  />
);

export default StyledTextField;
