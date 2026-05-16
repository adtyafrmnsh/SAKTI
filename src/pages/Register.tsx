import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Card, Button } from '../components/ui/Base';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'mahasiswa'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError("Passwords don't match");
    if (!captchaToken) return setError("Please verify you are not a robot");
    
    setLoading(true);
    setError('');
    
    try {
      // Backend verification
      const verifyRes = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaToken }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setLoading(false);
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
        return setError("reCAPTCHA verification failed. Please try again.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Create profile - WAIT for it to succeed
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: formData.email,
          role: formData.role,
          status: 'active',
          createdAt: serverTimestamp()
        });
      } catch (dbErr: any) {
        console.error("Database initialization failed:", dbErr);
        setError("Database error: " + dbErr.message);
        setLoading(false);
        // Important: if DB fails, we might want to delete the auth user or notify them
        return;
      }

      await sendEmailVerification(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 geometric-bg">
      <Card className="w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 font-display">Create Profile</h1>
          <p className="font-bold text-gray-500">Choose your side in AcademiX</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-black p-3 mb-4 font-bold text-red-600 uppercase text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'mahasiswa' })}
              className={`p-4 border-4 border-black font-black uppercase text-sm flex flex-col items-center justify-center transition-all ${formData.role === 'mahasiswa' ? 'bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black'}`}
            >
              <span>Student</span>
              <span className="text-[10px] opacity-70">Mahasiswa</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'dosen' })}
              className={`p-4 border-4 border-black font-black uppercase text-sm flex flex-col items-center justify-center transition-all ${formData.role === 'dosen' ? 'bg-secondary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black'}`}
            >
              <span>Teacher</span>
              <span className="text-[10px] opacity-70">Dosen</span>
            </button>
          </div>

          <div>
            <label className="block font-black uppercase text-xs mb-1">Email Address</label>
            <input 
              type="email" 
              className="neo-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-black uppercase text-xs mb-1">Password</label>
              <input 
                type="password" 
                className="neo-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block font-black uppercase text-xs mb-1">Confirm Secret</label>
              <input 
                type="password" 
                className="neo-input"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Google reCAPTCHA */}
          <div className="flex justify-center py-2 relative z-10">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} 
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <Button type="submit" variant="black" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Register Account'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="font-bold">
            Already have an account? <Link to="/" className="text-primary underline decoration-4 underline-offset-4 hover:text-black">Sign In</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
