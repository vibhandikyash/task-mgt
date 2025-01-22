import { Box, Typography } from "@mui/material";
import IconButton from "../atoms/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { RoleBasedRender } from './RoleBasedRender';


interface SectionHeaderProps {
  title: string;
  onAddClick: () => void;
  onDrawerToggle?: () => void;
  showDrawerIcon?: boolean;
}

const SectionHeader = ({ title, onAddClick, onDrawerToggle, showDrawerIcon }: SectionHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 0,
      p: 1,
    }}
  >
    <Link href="/" style={{ textDecoration: 'none' }}>
      <Typography variant="h5" sx={{ color: "white", fontWeight: 600, cursor: 'pointer' }}>
        {title}
      </Typography>
    </Link>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <RoleBasedRender>
        <IconButton size="small" startIcon={<AddIcon />} onClick={onAddClick}>
          Add
        </IconButton>
      </RoleBasedRender>
      {showDrawerIcon && (
        <IconButton size="small" onClick={onDrawerToggle}>
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  </Box>
);

export default SectionHeader;
