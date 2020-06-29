import { createMuiTheme } from '@material-ui/core/styles';

export const THEME = createMuiTheme({
  palette: {
    primary: {
      main: "#02346d",
    },
    secondary: {
      main: '#77ddf2',
    },
  },
  typography: {
    h1: {
      fontSize: '1.5rem',
    },
    h2: {
      fontSize: '1.4rem',
    },
    h3: {
      fontSize: '1.2rem',
    },
  },
});
