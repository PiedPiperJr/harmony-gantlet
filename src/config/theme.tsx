import { createTheme } from '@mui/material/styles';

// Augment the Palette interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    blue: Palette['primary'];
    green: Palette['primary'];
    orange: Palette['primary'];
    red: Palette['primary'];
  }

  interface PaletteOptions {
    blue?: PaletteOptions['primary'];
    green?: PaletteOptions['primary'];
    orange?: PaletteOptions['primary'];
    red?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    blue: true;
    green: true;
    orange: true;
    red: true;
  }
}

declare module '@mui/material/Checkbox' {
  interface CheckboxPropsColorOverrides {
    blue: true;
    green: true;
    orange: true;
    red: true;
  }
}

declare module '@mui/material/Slider' {
  interface SliderPropsColorOverrides {
    blue: true;
    green: true;
    orange: true;
    red: true;
  }
}

export const theme = createTheme({
  palette: {
    blue: {
      main: '#005FFE',
    },
    green: {
      main: '#0EAD69',
    },
    orange: {
      main: '#F49A47',
    },
    red: {
      main: '#FF5D47',
    },
  },
});
