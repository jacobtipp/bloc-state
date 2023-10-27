import { Typography } from '@mui/material';

export function TodosOverviewEmptyText() {
  return (
    <Typography
      variant="caption"
      component="div"
      sx={{
        flexGrow: 1,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      No todos found with the selected filters
    </Typography>
  );
}
