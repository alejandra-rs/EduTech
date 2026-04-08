import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { loginConfig } from "@services/authConfig.js";
import "./index.css";
import App from "./prueba.jsx";

const msalInstance = new PublicClientApplication(loginConfig);

const root = createRoot(document.getElementById("root"));
root.render(
  <MsalProvider instance={msalInstance}>
      <App />
  </MsalProvider>
);
