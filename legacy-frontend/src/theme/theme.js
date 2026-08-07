import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FF9900",
      light: "#FFB347",
      dark: "#E47911",
      contrastText: "#000000",
    },
    secondary: {
      main: "#131921",
      light: "#232F3E",
      dark: "#0F1111",
      contrastText: "#ffffff",
    },
    background: {
      default: "#EAEDED",
      paper: "#ffffff",
    },
    text: {
      primary: "#0F1111",
      secondary: "#565959",
    },
    error: {
      main: "#B12704",
    },
    success: {
      main: "#007600",
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  typography: {
    fontFamily: "'Inter', 'Poppins', sans-serif",
    h1: { fontSize: "6rem", "@media (max-width:960px)": { fontSize: "5rem" }, "@media (max-width:600px)": { fontSize: "4rem" }, "@media (max-width:414px)": { fontSize: "2.5rem" } },
    h2: { fontSize: "3.75rem", "@media (max-width:960px)": { fontSize: "3rem" }, "@media (max-width:662px)": { fontSize: "2.3rem" }, "@media (max-width:414px)": { fontSize: "2.2rem" } },
    h3: { fontSize: "3rem", "@media (max-width:960px)": { fontSize: "2.4rem" }, "@media (max-width:662px)": { fontSize: "2rem" }, "@media (max-width:414px)": { fontSize: "1.7rem" } },
    h4: { fontSize: "2.125rem", "@media (max-width:960px)": { fontSize: "1.5rem" }, "@media (max-width:600px)": { fontSize: "1.25rem" } },
    h5: { fontSize: "1.5rem", "@media (max-width:960px)": { fontSize: "1.25rem" }, "@media (max-width:600px)": { fontSize: "1.1rem" } },
    h6: { fontSize: "1.25rem", "@media (max-width:960px)": { fontSize: "1.1rem" }, "@media (max-width:600px)": { fontSize: "1rem" } },
    body1: { fontSize: "1rem" },
    body2: { fontSize: ".9rem" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          backgroundColor: "#FF9900",
          color: "#000",
          boxShadow: "0 1px 0 rgba(255,255,255,.4) inset,0 1px 2px rgba(0,0,0,.2)",
          "&:hover": { backgroundColor: "#E47911" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            "&:hover fieldset": { borderColor: "#FF9900" },
            "&.Mui-focused fieldset": { borderColor: "#FF9900", borderWidth: "1px" },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: "#131921", color: "#ffffff" },
      },
    },
  },
});

export default theme;
