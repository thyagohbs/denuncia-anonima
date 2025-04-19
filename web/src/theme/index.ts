import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Definindo as cores principais baseadas no disque-denuncia
const colors = {
  primary: {
    main: "#1565c0", // Azul mais escuro como no site original
    light: "#5e92f3",
    dark: "#003c8f",
    contrastText: "#fff",
  },
  secondary: {
    main: "#ff5722", // Cor de destaque para botões secundários
    light: "#ff8a50",
    dark: "#c41c00",
    contrastText: "#fff",
  },
  error: {
    main: "#d32f2f",
    light: "#ef5350",
    dark: "#c62828",
  },
  warning: {
    main: "#ffa000",
    light: "#ffb74d",
    dark: "#f57f17",
  },
  info: {
    main: "#0288d1",
    light: "#03a9f4",
    dark: "#01579b",
  },
  success: {
    main: "#388e3c",
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
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
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
    button: {
      textTransform: "none", // Como no site original
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Botões mais quadrados como no site original
          boxShadow: "none", // Menos sombra
          textTransform: "none", // Sem caps
          fontWeight: 500,
          // Garantir tamanho mínimo recomendado para touch targets
          minHeight: "48px",
          "@media (max-width: 600px)": {
            minWidth: "48px",
          },
        },
        // Adicionando tamanhos responsivos para botões
        sizeLarge: {
          padding: "12px 22px", // Aumenta area de toque
          "@media (max-width: 600px)": {
            padding: "12px 16px",
          },
        },
        contained: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)", // Sombra sutil
          "&:hover": {
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: "8px",
          marginBottom: "8px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 4, // Cantos menos arredondados como no site original
          "@media (max-width: 600px)": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          "&:hover": {
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          },
          "@media (max-width: 600px)": {
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.main,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)", // Sombra sutil
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 65, // Altura maior para melhor área de toque
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          padding: "12px 0",
          minWidth: "auto",
          "@media (max-width: 600px)": {
            paddingTop: "10px",
            paddingBottom: "10px",
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Aplicando responsividade às fontes
theme = responsiveFontSizes(theme);

export default theme;
