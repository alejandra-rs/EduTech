import { createRoot } from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { loginConfig } from "./services/authConfig.js";
import "./index.css";
import App from "./app";

const msalInstance = new PublicClientApplication(loginConfig);

msalInstance.initialize().then(() => {
  const container = document.getElementById("root");
  
  if (container) {
    const root = createRoot(container);
    root.render(
      <MsalProvider instance={msalInstance}>
          <App />
      </MsalProvider>
    );
  }
});