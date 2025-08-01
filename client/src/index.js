import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Mount to the <div id="root"> in public/index.html
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
