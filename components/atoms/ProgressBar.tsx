import { LinearProgress, Box, Typography } from '@mui/material';

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
}

export default function ProgressBar({ value, showLabel = true }: ProgressBarProps) {
  return (
    <Box sx={{ width: '100%' }}>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            Progress
          </Typography>
          <Typography sx={{ color: 'white', fontWeight: 500 }}>
            {value}%
          </Typography>
        </Box>
      )}
      <LinearProgress 
        variant="determinate" 
        value={value}
        sx={{
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: 1,
          height: 6,
          '& .MuiLinearProgress-bar': {
            bgcolor: value === 100 ? '#4CAF50' : '#2196F3',
            borderRadius: 1,
          },
        }}
      />
    </Box>
  );
} 