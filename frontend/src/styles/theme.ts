import { type ThemeOptions } from "@mui/material/styles";
import deepmerge from "deepmerge";

export const baseThemeOptions: ThemeOptions = {
    // Color
    palette: {
        primary: {
            main: "#3e50b4",
            light: "rgb(100, 115, 195)",
            dark: "rgb(43, 56, 125)",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#ff3f80",
            light: "rgb(255, 101, 153)",
            dark: "rgb(178, 44, 89)",
            contrastText: "#fff",
        },
    },
    // Text
    typography: {
        fontFamily: ['"Inter"', '"Helvetica Neue"', "Arial", "sans-serif"].join(
            ","
        ),
        h1: {
            fontSize: "3rem",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.01562em",
        },
        h2: {
            fontSize: "2.25rem",
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: "1.75rem",
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: "1.5rem",
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h5: {
            fontSize: "1.25rem",
            fontWeight: 500,
            lineHeight: 1.6,
        },
        h6: {
            fontSize: "1rem",
            fontWeight: 500,
            lineHeight: 1.7,
        },
        subtitle1: {
            fontSize: "1rem",
            fontWeight: 400,
            color: "rgba(0,0,0,0.7)",
        },
        subtitle2: {
            fontSize: "0.875rem",
            fontWeight: 400,
            color: "rgba(0,0,0,0.6)",
        },
        body1: {
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.6,
        },
        body2: {
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: 1.5,
        },
        button: {
            fontSize: "1.0rem",
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.05em",
        },
        caption: {
            fontSize: "0.75rem",
            fontWeight: 400,
            color: "rgba(0,0,0,0.6)",
        },
        overline: {
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
        },
    },
};

export const lightThemeOptions: ThemeOptions = deepmerge(baseThemeOptions, {
    palette: {
        mode: "light",
        background: {
            default: "#fff",
            paper: "#fff",
        },
        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.6)",
            disabled: "rgba(0, 0, 0, 0.38)",
            hint: "rgba(0, 0, 0, 0.38)",
        },
        error: {
            main: "#d32f2f",
            light: "#ef5350",
            dark: "#c62828",
            contrastText: "#fff",
        },
        warning: {
            main: "#ed6c02",
            light: "#ff9800",
            dark: "#e65100",
            contrastText: "#fff",
        },
        info: {
            main: "#0288d1",
            light: "#03a9f4",
            dark: "#01579b",
            contrastText: "#fff",
        },
        success: {
            main: "#2e7d32",
            light: "#4caf50",
            dark: "#1B5E20",
            contrastText: "#fff",
        },
        divider: "rgba(0, 0, 0, 0.12)",
    },
});

export const darkThemeOptions: ThemeOptions = deepmerge(baseThemeOptions, {
    palette: {
        mode: "dark",
        background: {
            default: "#121212",
            paper: "#121212",
        },
        text: {
            primary: "#fff",
            secondary: "rgba(255, 255, 255, 0.7)",
            disabled: "rgba(255, 255, 255, 0.5)",
            hint: "rgba(255, 255, 255, 0.5)",
        },
        error: {
            main: "#f44336",
            light: "#e57373",
            dark: "#d32f2f",
            contrastText: "#fff",
        },
        warning: {
            main: "#ffa726",
            light: "#ffb74d",
            dark: "#f57c00",
            contrastText: "rgba(0, 0, 0, 0.87)",
        },
        info: {
            main: "#29b6f6",
            light: "#4fc3f7",
            dark: "#0288d1",
            contrastText: "rgba(0, 0, 0, 0.87)",
        },
        success: {
            main: "#66bb6a",
            light: "#81c784",
            dark: "#388e3c",
            contrastText: "rgba(0, 0, 0, 0.87)",
        },
        divider: "rgba(255, 255, 255, 0.12)",
    },
});
