import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './component/ErrorBoundary';
import Loading from './component/Loading';

const MainLayout = lazy(() => import('./layout/MainLayout'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const SetupSecurity = lazy(() => import('./pages/SetupSecurity'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SpareParts = lazy(() => import('./pages/SpareParts'));
const StockIn = lazy(() => import('./pages/StockIn'));
const StockOut = lazy(() => import('./pages/StockOut'));
const Reports = lazy(() => import('./pages/Reports'));

function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
}

function AuthWelcome() {
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;
  return <Welcome />;
}

function NotFound() {
  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
      <div className="bg-white border border-brand-border rounded-2xl p-8 max-w-md text-center shadow-sm">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-brand-text mb-2">Page Not Found</h2>
        <p className="text-sm text-brand-muted mb-6 leading-relaxed">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-[10px] text-sm font-semibold hover:bg-brand-hover transition-colors">Go Home</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<AuthWelcome />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/setup-security" element={<PrivateRoute><SetupSecurity /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="spare-parts" element={<SpareParts />} />
              <Route path="stock-in" element={<StockIn />} />
              <Route path="stock-out" element={<StockOut />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
