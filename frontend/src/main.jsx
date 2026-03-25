import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    {/* 🔥 Global Toast Container */}
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#0f172a",
          color: "#fff",
          border: "1px solid rgba(59,130,246,0.4)"
        }
      }}
    />
  </StrictMode>
);