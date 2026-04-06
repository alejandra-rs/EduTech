import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import VistaPreviaDocumento from "./pages/VistaPreviaDocumento";
import App from "./prueba";

const root = createRoot(document.getElementById("root"));
root.render(
  <App />
);
