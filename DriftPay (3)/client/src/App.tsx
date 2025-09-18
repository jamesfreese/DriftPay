
import * as React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import DriftpayPage from './pages/DriftpayPage';
import JournalPage from './pages/JournalPage';
import StatsPage from './pages/StatsPage';
import MarketPage from './pages/MarketPage';
import ConvertPage from './pages/ConvertPage';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import { useNotifications } from './hooks/useNotifications';

const useAuth = () => {
  // This is a mock auth check. In a real app, this would involve tokens, sessions, etc.
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return { isLoggedIn };
};

function AppContent() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  useNotifications();

  if (!isLoggedIn) {
    // Redirect to login page if not authenticated, preserving the intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DriftpayPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/convert" element={<ConvertPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  React.useEffect(() => {
    const appVersion = '1.0.1'; // Increment this version to trigger a reset
    const lastVersion = localStorage.getItem('app_version');

    if (lastVersion !== appVersion) {
      console.log('App version changed, resetting local storage.');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('dp_') || ['isLoggedIn', 'owner', 'email', 'app_reset_flag'].includes(key)) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('app_version', appVersion);
      window.location.href = '/login';
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<AppContent />} />
    </Routes>
  );
}

export default App;
