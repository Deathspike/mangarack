import * as mui from 'material-ui';

// Remember, `manifest.json` includes the theme color.
export const theme = mui.createMuiTheme({
  breakpoints: {
    values: {xs: 0, sm: 0, md: 0, lg: 0, xl: 0}
  },
  palette: {
    primary: {
      contrastText: '#fafafa',
      dark: '#0064b7',
      light: '#64c1ff',
      main: '#0091ea'
    },
    secondary: {
      contrastText: '#fafafa',
      dark: '#008e76',
      light: '#5df2d6',
      main: '#00bfa5'
    }
  }
});
