import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Definindo as cores principais
const colors = {
  primary: {
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#fff",
  },
  secondary: {
    main: "#9c27b0",
    light: "#ba68c8",
    dark: "#7b1fa2",
    contrastText: "#fff",
  },
  error: {
    main: "#d32f2f",
    light: "#ef5350",
    dark: "#c62828",
  },
  warning: {
    main: "#ed6c02",
    light: "#ff9800",
    dark: "#e65100",
  },
  info: {
    main: "#0288d1",
    light: "#03a9f4",
    dark: "#01579b",
  },
  success: {
    main: "#2e7d32",
    light: "#4caf50",
    dark: "#1b5e20",
  },
};

// Criando o tema base
let theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    error: {
      main: colors.error.main,
    },
    warning: {
      main: colors.warning.main,
    },
    info: {
      main: colors.info.main,
    },
    success: {
      main: colors.success.main,
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

// Aplicando responsividade às fontes
theme = responsiveFontSizes(theme);

export default theme;
