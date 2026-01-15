// src/main.tsx
import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";

// 🔧 Polyfills for TON libs (MUST be before App import)
import { Buffer } from "buffer";
import process from "process";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TONCONNECT_MANIFEST_URL } from "./lib/config";

// 🌍 globals for TON / bundlers
(globalThis as any).Buffer = Buffer;
(globalThis as any).process = process;
(globalThis as any).global = globalThis;

async function bootstrap() {
  const { default: App } = await import("./app/App");

  const rootEl = document.getElementById("root");
  if (!rootEl) return;

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <TonConnectUIProvider manifestUrl={TONCONNECT_MANIFEST_URL}>
        <App />
      </TonConnectUIProvider>
    </React.StrictMode>
  );
}

bootstrap();
