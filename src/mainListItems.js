import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BarChartIcon from '@mui/icons-material/BarChart';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Extrato" />
    </ListItemButton>
  </React.Fragment>
);