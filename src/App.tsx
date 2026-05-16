import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import MahasiswaDashboard from './pages/Mahasiswa/Dashboard';
import MahasiswaProfile from './pages/Mahasiswa/Profile';
import DosenDashboard from './pages/Dosen/Dashboard';
import DosenDetail from './pages/Dosen/Detail';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            console.error("User profile document missing in Firestore");
            setRole('mahasiswa'); // Default fallback or handle error
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white geometric-bg">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h1 className="mt-4 font-display text-2xl font-black uppercase tracking-tighter">SAKTI Loading...</h1>
      </div>
    );
  }

  // Auth Protection Logic
  const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
    if (!user) return <Navigate to="/" replace />;
    
    // Allow access to verify even if role is not yet loaded
    if (!user.emailVerified) return <Navigate to="/verify" replace />;

    // Wait for role to load before enforcing role-based protection
    if (loading) return null; 

    if (requiredRole && role !== requiredRole) {
      const target = role === 'dosen' ? '/dosen' : '/mahasiswa';
      return <Navigate to={target} replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={user ? <Navigate to={role === 'dosen' ? '/dosen' : '/mahasiswa'} replace /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Mahasiswa Routes */}
        <Route 
          path="/mahasiswa" 
          element={
            <ProtectedRoute requiredRole="mahasiswa">
              <MahasiswaDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mahasiswa/profile" 
          element={
            <ProtectedRoute requiredRole="mahasiswa">
              <MahasiswaProfile />
            </ProtectedRoute>
          } 
        />

        {/* Dosen Routes */}
        <Route 
          path="/dosen" 
          element={
            <ProtectedRoute requiredRole="dosen">
              <DosenDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dosen/mahasiswa/:id" 
          element={
            <ProtectedRoute requiredRole="dosen">
              <DosenDetail />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
