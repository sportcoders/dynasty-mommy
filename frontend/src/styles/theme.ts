import { type ThemeOptions } from '@mui/material/styles';
import deepmerge from 'deepmerge'

export const baseThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#3e50b4',
      light: 'rgb(100, 115, 195)',
      dark: 'rgb(43, 56, 125)',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#ff3f80',
      light: 'rgb(255, 101, 153)',
      dark: 'rgb(178, 44, 89)',
      contrastText: '#fff',
    },
  },
}

export const lightThemeOptions: ThemeOptions = deepmerge(baseThemeOptions, {
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
})

export const darkThemeOptions: ThemeOptions = deepmerge (baseThemeOptions ,{
  palette: {
    mode: 'dark',
    background: {
      default:'#121212',
      paper: '#121212',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      hint: 'rgba(255, 255, 255, 0.5)', 
    },
    error: {
      main: '#f44336',                 
      light: '#e57373',                
      dark: '#d32f2f',               
      contrastText: '#fff',           
    },
    warning: {
      main: '#ffa726',                 
      light: '#ffb74d',                
      dark: '#f57c00',               
      contrastText: 'rgba(0, 0, 0, 0.87)',           
    },
    info: {
      main: '#29b6f6',                 
      light: '#4fc3f7',                
      dark: '#0288d1',               
      contrastText: 'rgba(0, 0, 0, 0.87)',           
    },
    success: {
      main: '#66bb6a',                 
      light: '#81c784',                
      dark: '#388e3c',               
      contrastText: 'rgba(0, 0, 0, 0.87)',           
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
})

