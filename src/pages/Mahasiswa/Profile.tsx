import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, auth, handleFirestoreError, OperationType } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Sidebar, DashboardHeader } from '../../components/layout/Internal';
import { Card, Button } from '../../components/ui/Base';
import { Save, CheckCircle } from 'lucide-react';

const profileSchema = z.object({
  nama: z.string().min(3, "Full name too short"),
  nim: z.string().min(5, "NIM must be at least 5 digits"),
  alamat: z.string().min(5, "Address too short"),
  nomorTelepon: z.string().regex(/^[0-9]+$/, "Must be digits only").min(10, "Min 10 digits"),
  kelas: z.string().min(1, "Field required"),
  email: z.string().email("Invalid official email"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function MahasiswaProfile() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, 'mahasiswas', auth.currentUser!.uid));
      if (docSnap.exists()) {
        reset(docSnap.data() as ProfileFormValues);
      } else {
        reset({ email: auth.currentUser?.email || '' });
      }
      setLoading(false);
    };
    fetchData();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await setDoc(doc(db, 'mahasiswas', auth.currentUser!.uid), {
        ...data,
        userId: auth.currentUser!.uid,
        updatedAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `mahasiswas/${auth.currentUser?.uid}`);
    }
  };

  return (
    <div className="pl-72 min-h-screen bg-gray-50">
      <Sidebar role="mahasiswa" />
      <DashboardHeader title="Profile Calibration" />

      <main className="p-12">
        <Card className="max-w-3xl mx-auto">
          <div className="mb-8 border-b-4 border-black pb-4">
            <h3 className="text-3xl font-black uppercase italic font-display">Identity Data</h3>
            <p className="font-bold text-gray-500 uppercase text-[10px] tracking-widest mt-1">Fields marked with impact academic standing</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField label="Full Official Name" name="nama" register={register} error={errors.nama?.message} />
              <FormField label="Registry ID (NIM)" name="nim" register={register} error={errors.nim?.message} />
              <div className="md:col-span-2">
                <FormField label="Physical Residence" name="alamat" register={register} error={errors.alamat?.message} />
              </div>
              <FormField label="Tactical Class Unit" name="kelas" register={register} error={errors.kelas?.message} />
              <FormField label="Comms Line (Phone)" name="nomorTelepon" register={register} error={errors.nomorTelepon?.message} />
              <FormField label="Electronic Mail" name="email" register={register} error={errors.email?.message} disabled={true} />
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                <Save className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Syncing...' : 'Save Profile Data'}
              </Button>
              {success && (
                <div className="flex items-center text-accent font-black uppercase text-xs italic">
                  <CheckCircle className="w-5 h-5 mr-2 animate-bounce" />
                  Successfully Encoded
                </div>
              )}
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

const FormField = ({ label, name, register, error, disabled = false }: any) => (
  <div>
    <label className="block font-black uppercase text-[10px] tracking-widest mb-2 text-black/60">{label}</label>
    <input 
      {...register(name)} 
      disabled={disabled}
      className={`neo-input ${disabled ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''} ${error ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}
    />
    {error && <p className="mt-2 text-xs font-bold text-red-500 uppercase italic">{error}</p>}
  </div>
)
