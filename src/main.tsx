// src/main.tsx
import "./index.css";
import ReactDOM from "react-dom/client";

// 🔧 Polyfills for TON libs (MUST be before App import)
import { Buffer } from "buffer";
import process from "process";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

// 🌍 globals for TON / bundlers
(globalThis as any).Buffer = Buffer;
(globalThis as any).process = process;
(globalThis as any).global = globalThis;

// ✅ Clean absolute manifest URL (NO StrictMode!)
const MANIFEST_URL = new URL("/tonconnect-manifest.json", window.location.origin).toString();

// ✅ Prevent double bootstrap (HMR / remount safety)
let bootstrapped = false;

async function bootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;

  const { default: App } = await import("./app/App");

  const rootEl = document.getElementById("root");
  if (!rootEl) return;

  ReactDOM.createRoot(rootEl).render(
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <App />
    </TonConnectUIProvider>
  );
}

bootstrap();
