import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { Provider } from "react-redux";
import { store } from "@/store/store.ts";
/* import "fluiditype/fluidtype.css"; */

const root = document.createElement("div") as HTMLDivElement;
root.className = "root";
document.body.insertAdjacentElement("afterbegin", root);

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.dataset["theme"] = "dark";
} else {
  document.body.dataset["theme"] = "light";
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
