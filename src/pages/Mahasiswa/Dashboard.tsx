import { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Sidebar, DashboardHeader } from '../../components/layout/Internal';
import { Card, Button } from '../../components/ui/Base';
import { User, MapPin, Phone, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MahasiswaDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'mahasiswas', auth.currentUser!.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="pl-72 min-h-screen bg-gray-50 flex flex-col">
      <Sidebar role="mahasiswa" />
      <DashboardHeader title="Command Overview" />
      
      <main className="p-12 space-y-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-primary text-white">
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Welcome back, Soldier</h3>
            <p className="font-bold text-black/70 mb-8 uppercase tracking-widest text-xs italic">Status: Online and Synchronized</p>
            <div className="flex items-center space-x-4">
              <Link to="/mahasiswa/profile" className="neo-btn bg-white text-black border-white shadow-none hover:bg-black hover:text-white hover:border-black">
                Manage Profile
              </Link>
            </div>
          </Card>

          <Card className="bg-secondary text-white">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Academic Rank</h3>
            <div className="text-6xl font-black font-display italic">S1</div>
            <p className="mt-4 font-bold text-black/50 uppercase text-xs">Standard Undergraduate Degree</p>
          </Card>
        </div>

        {!loading && !data ? (
          <Card className="border-red-500 bg-red-50">
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-red-100 border-4 border-red-500">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <h4 className="text-2xl font-black uppercase mb-2 text-red-700">Missing Data Detected</h4>
                <p className="font-bold text-gray-600 mb-6 max-w-lg">Your academic record is zeroed out. You must calibrate your profile immediately to access university resources.</p>
                <Link to="/mahasiswa/profile">
                  <Button variant="black">Initialize Profile Now</Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : !loading && data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InfoItem icon={User} label="Official Identity" val={data.nama} />
            <InfoItem icon={GraduationCap} label="Registry ID (NIM)" val={data.nim} color="bg-secondary" />
            <InfoItem icon={MapPin} label="Home Port" val={data.alamat} />
            <InfoItem icon={Phone} label="Emergency Line" val={data.nomorTelepon} color="bg-accent" />
            <InfoItem icon={GraduationCap} label="Tactical Unit (Kelas)" val={data.kelas} />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <h2 className="font-black italic uppercase text-gray-300 animate-pulse text-4xl">Syncing Data...</h2>
          </div>
        )}
      </main>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, val, color = "bg-primary" }: any) => (
  <Card className="relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 -mr-8 -mt-8 rotate-12`}></div>
    <div className="flex items-center space-x-4 mb-4">
      <div className={`p-2 border-2 border-black ${color} text-white`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">{label}</span>
    </div>
    <p className="text-2xl font-black font-display italic tracking-tight uppercase truncate">{val}</p>
  </Card>
)
