import { type ThemeOptions, type Shadows } from "@mui/material/styles";
import deepmerge from "deepmerge";

// --- Base Theme Options ---
export const baseThemeOptions: ThemeOptions = {
    // Colors
    palette: {
        primary: {
            main: "#5C6BC0",
            light: "#8e99f3",
            dark: "#26418f",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#FF8A65",
            light: "#ffbb93",
            dark: "#c75a39",
            contrastText: "#fff",
        },
        info: {
            main: "#2196F3",
            light: "#64b5f6",
            dark: "#1976d2",
            contrastText: "#fff",
        },
        success: {
            main: "#4CAF50",
            light: "#81c784",
            dark: "#388e3c",
            contrastText: "#fff",
        },
        warning: {
            main: "#FFC107",
            light: "#ffdd4b",
            dark: "#ffa000",
            contrastText: "rgba(0, 0, 0, 0.87)",
        },
        error: {
            main: "#F44336",
            light: "#e57373",
            dark: "#d32f2f",
            contrastText: "#fff",
        },
    },

    // Typography
    typography: {
        fontFamily: [
            '"Inter"',
            '"Roboto"',
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
        ].join(","),
        h1: {
            fontSize: "3.5rem",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
        },
        h2: {
            fontSize: "2.75rem",
            fontWeight: 600,
            lineHeight: 1.25,
        },
        h3: {
            fontSize: "2.25rem",
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h4: {
            fontSize: "1.8rem",
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: "1.4rem",
            fontWeight: 500,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: "1.15rem",
            fontWeight: 500,
            lineHeight: 1.6,
        },
        subtitle1: {
            fontSize: "1.05rem",
            fontWeight: 400,
        },
        subtitle2: {
            fontSize: "0.95rem",
            fontWeight: 400,
        },
        body1: {
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.65,
        },
        body2: {
            fontSize: "0.9rem",
            fontWeight: 400,
            lineHeight: 1.55,
        },
        button: {
            fontSize: "1.0rem",
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.02em",
        },
        caption: {
            fontSize: "0.75rem",
            fontWeight: 400,
        },
        overline: {
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
        },
    },
    // Shape
    shape: {
        borderRadius: 8,
    },
    // Shadow
    shadows: [
        "none",
        "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
        "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)",
        "0px 5px 15px rgba(0, 0, 0, 0.12), 0px 2px 5px rgba(0, 0, 0, 0.08)",
        "0px 8px 20px rgba(0, 0, 0, 0.15), 0px 3px 8px rgba(0, 0, 0, 0.1)",
        "0px 10px 25px rgba(0, 0, 0, 0.18), 0px 4px 10px rgba(0, 0, 0, 0.12)",
        ...Array(19).fill("none"),
    ] as Shadows,
    // Custom Components
    components: {
        MuiAccordion: {
            styleOverrides: {
                root: {
                    "&.Mui-expanded": {
                        margin: "16px 0",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    overflow: "hidden",
                },
                body: {
                    overflow: "hidden",
                },
            },
        },
    },
};

// --- Light Theme Options ---
export const lightThemeOptions: ThemeOptions = deepmerge(baseThemeOptions, {
    palette: {
        mode: "light",
        background: {
            default: "#F5F7FA",
            paper: "#FFFFFF",
        },
        text: {
            primary: "rgba(29, 30, 31, 0.9)",
            secondary: "rgba(29, 30, 31, 0.7)",
            disabled: "rgba(29, 30, 31, 0.4)",
            hint: "rgba(29, 30, 31, 0.4)",
        },
        divider: "rgba(29, 30, 31, 0.1)",
    },
});

// --- Dark Theme Options ---
export const darkThemeOptions: ThemeOptions = deepmerge(baseThemeOptions, {
    palette: {
        mode: "dark",
        background: {
            default: "#121212",
            paper: "#1E1E1E",
        },
        text: {
            primary: "#FFFFFF",
            secondary: "rgba(255, 255, 255, 0.8)",
            disabled: "rgba(255, 255, 255, 0.5)",
            hint: "rgba(255, 255, 255, 0.5)",
        },
        divider: "rgba(255, 255, 255, 0.15)",
    },
});
