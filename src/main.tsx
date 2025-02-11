import React from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./modules/app/application";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<Application />);
}
