import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Sidebar, DashboardHeader } from '../../components/layout/Internal';
import { Card, Button } from '../../components/ui/Base';
import { Save, ChevronLeft, CheckCircle, Trash2 } from 'lucide-react';

const editSchema = z.object({
  nama: z.string().min(3, "Full name too short"),
  nim: z.string().min(5, "NIM must be at least 5 digits"),
  alamat: z.string().min(5, "Address too short"),
  nomorTelepon: z.string().regex(/^[0-9]+$/, "Must be digits only").min(10, "Min 10 digits"),
  kelas: z.string().min(1, "Field required"),
  email: z.string().email("Invalid official email"),
});

export default function DosenDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, 'mahasiswas', id));
      if (docSnap.exists()) {
        reset(docSnap.data());
      }
      setLoading(false);
    };
    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (!id) return;
      await updateDoc(doc(db, 'mahasiswas', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `mahasiswas/${id}`);
    }
  };

  if (loading) return null;

  return (
    <div className="pl-72 min-h-screen bg-gray-50">
      <Sidebar role="dosen" />
      <DashboardHeader title="Subject Override" />

      <main className="p-12">
        <div className="mb-12">
          <button 
            onClick={() => navigate('/dosen')}
            className="flex items-center font-black uppercase text-xs hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Abort & Return to Command
          </button>
          <div className="flex items-end justify-between">
            <h1 className="text-5xl font-black uppercase italic font-display tracking-tighter">Modify Registry</h1>
            <p className="font-bold text-gray-500 bg-white border-2 border-black px-4 py-2 uppercase text-[10px]">Registry ID: {id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <Card className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Subject Entity" name="nama" register={register} error={errors.nama?.message} />
                <FormField label="Official Registry Code" name="nim" register={register} error={errors.nim?.message} />
                <div className="md:col-span-2">
                  <FormField label="Location Coordinates" name="alamat" register={register} error={errors.alamat?.message} />
                </div>
                <FormField label="Unit Type" name="kelas" register={register} error={errors.kelas?.message} />
                <FormField label="Comms Frequency" name="nomorTelepon" register={register} error={errors.nomorTelepon?.message} />
                <FormField label="Official Email" name="email" register={register} error={errors.email?.message} />
              </div>

              <div className="flex items-center space-x-6 pt-4 border-t-4 border-black/5 pt-8">
                <Button type="submit" variant="primary" className="h-16 px-10" disabled={isSubmitting}>
                  <Save className="w-5 h-5 mr-3" />
                  {isSubmitting ? 'Syncing...' : 'Authorize Override'}
                </Button>
                {success && (
                  <div className="flex items-center text-accent font-black uppercase text-xs italic">
                    <CheckCircle className="w-6 h-6 mr-3 animate-bounce" />
                    Record Calibrated
                  </div>
                )}
              </div>
            </form>
          </Card>

          <div className="space-y-8">
            <Card className="bg-red-50 border-red-500">
              <h4 className="text-xl font-black uppercase text-red-600 mb-4">Critical Action Zone</h4>
              <p className="text-xs font-bold text-gray-600 mb-8 uppercase leading-relaxed">
                Deletion will permanently remove this entity from the centralized database. This action is terminal and audited.
              </p>
              <Button variant="black" className="w-full bg-red-600 border-red-900 group">
                <Trash2 className="w-5 h-5 mr-3 group-hover:animate-shake" />
                Terminate Record
              </Button>
            </Card>
            
            <Card className="bg-black text-white">
              <div className="text-[10px] font-black uppercase opacity-50 mb-2">Audit Information</div>
              <p className="text-xs font-bold italic">This entity is subject to University Policy 404-X regarding data integrity and privacy.</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

const FormField = ({ label, name, register, error }: any) => (
  <div>
    <label className="block font-black uppercase text-[10px] tracking-widest mb-3 text-black/40">{label}</label>
    <input 
      {...register(name)} 
      className={`neo-input ${error ? 'border-red-500 bg-red-50' : 'bg-white'}`}
    />
    {error && <p className="mt-2 text-[10px] font-black text-red-600 uppercase italic bg-red-100 p-1 px-2 border-l-4 border-red-600">{error}</p>}
  </div>
)
