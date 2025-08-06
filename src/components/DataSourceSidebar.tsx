import { Box, Typography } from '@mui/material';

const DataSourceSidebar = () => {
  // Placeholder for data source and threshold controls
  return (
    <Box sx={{ width: 260, bgcolor: '#23263a', color: '#fff', p: 3, borderRadius: 2, minHeight: 400 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>Data Sources</Typography>
      {/* Add controls for selecting data source, setting thresholds, etc. */}
      <Typography variant="body2" sx={{ color: '#b0b8d1' }}>
        (Sidebar controls for data source selection and threshold rules will appear here.)
      </Typography>
    </Box>
  );
};

export default DataSourceSidebar;
