import { toTemporalInstant } from "@js-temporal/polyfill";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

//@ts-expect-error TS does not know about Temporal yet
Date.prototype.toTemporalInstant = toTemporalInstant;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
