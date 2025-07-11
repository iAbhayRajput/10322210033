import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00bcd4' }, // cyan
    secondary: { main: '#ff4081' }, // pink
    background: {
      default: '#181a20',
      paper: '#23272f',
    },
    text: {
      primary: '#fff',
      secondary: '#b0b8c1',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '0.05em' },
    h2: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme; 