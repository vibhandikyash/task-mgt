import {
  FormControl,
  InputLabel,
  Select,
  SelectProps,
  FormControlProps,
  SelectChangeEvent,
} from "@mui/material";
import { ReactNode } from "react";

interface StyledSelectProps extends Omit<SelectProps, "label" | "onChange"> {
  label: string;
  children: ReactNode;
  formControlProps?: FormControlProps;
  onChange?: (event: SelectChangeEvent<unknown>, child: ReactNode) => void;
}

const StyledSelect = ({
  label,
  children,
  formControlProps,
  onChange,
  ...props
}: StyledSelectProps) => (
  <FormControl
    fullWidth
    {...formControlProps}
    sx={{
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
      "& .MuiMenuItem-root": {
        color: "black",
      },
      ...formControlProps?.sx,
    }}
  >
    <InputLabel>{label}</InputLabel>
    <Select 
      label={label} 
      onChange={onChange}
      {...props}
    >
      {children}
    </Select>
  </FormControl>
);

export default StyledSelect;
