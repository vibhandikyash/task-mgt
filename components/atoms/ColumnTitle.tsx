import { Typography } from '@mui/material';

interface ColumnTitleProps {
  title: string;
}

const ColumnTitle = ({ title }: ColumnTitleProps) => (
  <Typography
    variant="subtitle1"
    sx={{
      color: "white",
      fontWeight: 600,
    }}
  >
    {title}
  </Typography>
);

export default ColumnTitle;