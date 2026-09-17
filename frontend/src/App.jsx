import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/Toast';

import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Citas } from './pages/Citas';
import { WhatsApp } from './pages/WhatsApp';

function App() {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}

export default App;
