import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { Sidebar, DashboardHeader } from '../../components/layout/Internal';
import { Card, Button } from '../../components/ui/Base';
import { Search, Eye, Edit3, Trash2, UserPlus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DosenDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'mahasiswas'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Permanently erase student record? This cannot be undone.")) {
      await deleteDoc(doc(db, 'mahasiswas', id));
      fetchStudents();
    }
  };

  const filteredStudents = students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nim.includes(searchTerm)
  );

  return (
    <div className="pl-72 min-h-screen bg-white">
      <Sidebar role="dosen" />
      <DashboardHeader title="Management Command" />

      <main className="p-12 space-y-12">
        {/* Analytics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard label="Total Personnel" val={students.length} color="bg-primary" />
          <StatCard label="Active Classes" val={[...new Set(students.map(s => s.kelas))].length} color="bg-secondary" />
          <StatCard label="Security Status" val="Optimal" color="bg-accent" />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black" />
            <input 
              type="text" 
              placeholder="Query by Identity (Name) or Registry Code (NIM)..."
              className="neo-input pl-12 h-16 text-lg placeholder:italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="black" className="h-16 px-8">
            <Filter className="w-5 h-5 mr-4" />
            Advanced Matrix
          </Button>
        </div>

        {/* Table View */}
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white border-b-4 border-black">
                <th className="p-6 font-black uppercase text-xs tracking-widest">Registry ID</th>
                <th className="p-6 font-black uppercase text-xs tracking-widest text-center">Identity</th>
                <th className="p-6 font-black uppercase text-xs tracking-widest">Tactical Unit</th>
                <th className="p-6 font-black uppercase text-xs tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="font-black italic text-4xl animate-pulse text-gray-200 uppercase">Synchronizing Records...</div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center font-bold text-gray-400 uppercase">Zero results found in database query.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b-4 border-black group hover:bg-gray-50 transition-colors">
                    <td className="p-6 font-black font-display italic text-lg">{student.nim}</td>
                    <td className="p-6">
                      <div className="font-black uppercase tracking-tight text-gray-900">{student.nama}</div>
                      <div className="font-bold text-xs text-gray-400">{student.email}</div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase italic">
                        {student.kelas}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-2">
                      <Link to={`/dosen/mahasiswa/${student.id}`}>
                        <button className="p-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-y-0 active:translate-y-1">
                          <Eye className="w-5 h-5" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-3 border-2 border-black bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-y-0 active:translate-y-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}

const StatCard = ({ label, val, color }: any) => (
  <Card className={`${color} text-white group`}>
    <h4 className="font-black uppercase text-[10px] tracking-[0.2em] mb-1 opacity-70 italic">{label}</h4>
    <p className="text-5xl font-black font-display italic tracking-tighter group-hover:scale-110 transition-transform origin-left">{val}</p>
  </Card>
)
