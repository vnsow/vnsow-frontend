import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Prevenir cambio de valor con rueda del mouse en inputs numéricos (global)
document.addEventListener('wheel', function(e) {
  if (e.target.type === 'number' && document.activeElement === e.target) {
    e.target.blur();
  }
}, { passive: true });
