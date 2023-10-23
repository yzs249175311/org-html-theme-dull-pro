import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { Provider } from "react-redux";
import { store } from "@/store/store.ts";
import "./default.scss";
import { createTheme, ThemeProvider } from "@mui/material";

/* import "fluiditype/fluidtype.css"; */

const root = document.createElement("div") as HTMLDivElement;
root.className = "root";
document.body.insertAdjacentElement("afterbegin", root);

let theme = {};

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.dataset["theme"] = "dark";
  theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
} else {
  document.body.dataset["theme"] = "light";
  theme = createTheme({
    palette: {
      mode: "light",
    },
  });
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
