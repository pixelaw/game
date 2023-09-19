import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setup } from './dojo/setup';
import { DojoProvider } from './DojoContext';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

async function init() {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('React root not found');
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const setupResult = await setup();
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient} >
        <DojoProvider value={setupResult}>
          <App />
        </DojoProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

init();