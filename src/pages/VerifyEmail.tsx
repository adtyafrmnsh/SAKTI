import { auth } from '../firebase';
import { Button, Card } from '../components/ui/Base';
import { Mail, LogOut } from 'lucide-react';

export default function VerifyEmail() {
  const handleCheckVerification = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        window.location.reload();
      } else {
        alert("Email belum terverifikasi. Silakan cek inbox/spam kembali.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white geometric-bg">
      <Card className="max-w-md text-center">
        <div className="w-20 h-20 bg-primary/20 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Validate Your Identity</h1>
        <p className="font-bold text-gray-600 mb-8 px-4">
          We've sent a magic link to <span className="text-black underline">{auth.currentUser?.email}</span>. Click it to unlock AcademiX.
        </p>
        
        <div className="space-y-4">
          <Button onClick={handleCheckVerification} variant="primary" className="w-full">
            I've Verified My Email
          </Button>
          <button 
            onClick={handleSignOut}
            className="flex items-center justify-center w-full font-black uppercase text-xs hover:text-primary transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Switch Account
          </button>
        </div>
      </Card>
    </div>
  );
}
