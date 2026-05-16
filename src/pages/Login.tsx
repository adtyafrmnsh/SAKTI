import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Card, Button } from '../components/ui/Base';
import { LogIn, Github, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handled by App.tsx observer
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 geometric-bg">
      <Card className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 font-display leading-[1]">
            SAKTI<br/><span className="text-primary italic text-2xl">Sistem Akademik Terpadu</span>
          </h1>
          <p className="font-bold text-gray-600 uppercase tracking-widest text-xs">Academic System Gateway</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-black p-3 mb-4 font-bold text-red-600 uppercase text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-black uppercase text-xs mb-1">Email Address</label>
            <input 
              type="email" 
              className="neo-input"
              placeholder="user@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-black uppercase text-xs mb-1">Secret Password</label>
            <input 
              type="password" 
              className="neo-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-[10px] font-black uppercase text-gray-400 hover:text-black hover:underline">Lost Secret?</Link>
            </div>
          </div>
          
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In Now'}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t-4 border-black"></span></div>
          <div className="relative flex justify-center text-xs uppercase font-black"><span className="bg-white px-4">Or Use Social</span></div>
        </div>

        <div className="text-center mt-6">
          <p className="font-bold">
            No account? <Link to="/register" className="text-primary underline decoration-4 underline-offset-4 hover:text-black">Join SAKTI</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
