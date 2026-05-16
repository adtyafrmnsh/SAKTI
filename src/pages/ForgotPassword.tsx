import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Card, Button } from '../components/ui/Base';
import { KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox for password reset instructions.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 geometric-bg">
      <Card className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-xs font-black uppercase hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        <div className="mb-8">
          <div className="w-16 h-16 bg-primary/10 border-4 border-black mb-4 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 font-display italic">Recover Key</h1>
          <p className="font-bold text-gray-500 uppercase text-[10px] tracking-widest">Authorized credential restoration</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-black p-3 mb-4 font-bold text-red-600 uppercase text-xs">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border-2 border-black p-4 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-accent mr-3" />
            <p className="font-bold text-accent uppercase text-xs">{message}</p>
          </div>
        )}

        {!message && (
          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block font-black uppercase text-xs mb-1 text-black/60">Registered Email Address</label>
              <input 
                type="email" 
                className="neo-input"
                placeholder="user@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Transmitting...' : 'Send Recovery Link'}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center border-t-4 border-black pt-6">
          <p className="font-bold text-xs uppercase text-gray-400 italic">
            Secure Encryption Gate active
          </p>
        </div>
      </Card>
    </div>
  );
}
