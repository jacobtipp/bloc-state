import { Box, CircularProgress } from '@mui/material';

export default function CircularLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
