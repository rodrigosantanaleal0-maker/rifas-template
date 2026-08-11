import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Checkout } from './pages/Checkout';
import { Regulation } from './pages/Regulation';
import { RouteLoadingBar } from './components/ui/RouteLoadingBar';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { CampaignEditor } from './pages/admin/Campaign';
import { Orders } from './pages/admin/Orders';
import { Participants } from './pages/admin/Participants';
import { Tickets } from './pages/admin/Tickets';
import { Results } from './pages/admin/Results';
import { Analytics } from './pages/admin/Analytics';
import { Settings } from './pages/admin/Settings';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <RouteLoadingBar />
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/regulamento" element={<Regulation />} />

            <Route path="/admin" element={<AdminLogin />} />
            <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/campaign" element={<CampaignEditor />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/participants" element={<Participants />} />
              <Route path="/admin/tickets" element={<Tickets />} />
              <Route path="/admin/results" element={<Results />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
