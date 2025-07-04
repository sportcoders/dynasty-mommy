import { type ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    background: {
      default:'#fff',
      paper: '#fff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)', 
    },
    primary: {
      main: '#3e50b4',
      light: 'rgb(100, 115, 195)',
      dark: 'rgb(43, 56, 125)',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff3f80',
      light: 'rgb(255, 101, 153)',
      dark: 'rgb(178, 44, 89)',
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f',                 
      light: '#ef5350',                
      dark: '#c62828',               
      contrastText: '#fff',           
    },
    warning: {
      main: '#ed6c02',                 
      light: '#ff9800',                
      dark: '#e65100',               
      contrastText: '#fff',           
    },
    info: {
      main: '#0288d1',                 
      light: '#03a9f4',                
      dark: '#01579b',               
      contrastText: '#fff',           
    },
    success: {
      main: '#2e7d32',                 
      light: '#4caf50',                
      dark: '#1B5E20',               
      contrastText: '#fff',           
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
};
