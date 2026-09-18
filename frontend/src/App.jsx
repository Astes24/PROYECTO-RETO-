import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFound } from './components/NotFound';

import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Citas } from './pages/Citas';
import { WhatsApp } from './pages/WhatsApp';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
