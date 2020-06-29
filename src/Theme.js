import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

export const THEME = createMuiTheme({
  palette: {
    primary: {
      main: "#02346d",
    },
    secondary: {
      main: green[500],
    },
  },
});
