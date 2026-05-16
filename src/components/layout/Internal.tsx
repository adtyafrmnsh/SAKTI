import { LogOut, User, LayoutDashboard, FileText, Settings, Search, Users } from 'lucide-react';
import { auth } from '../../firebase';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = ({ role }: { role: string }) => {
  const location = useLocation();
  const menuItems = role === 'dosen' ? [
    { icon: LayoutDashboard, label: 'Control Room', path: '/dosen' },
    { icon: Search, label: 'Search Students', path: '/dosen#search' },
    { icon: Users, label: 'All Registrations', path: '/dosen' },
  ] : [
    { icon: LayoutDashboard, label: 'Overview', path: '/mahasiswa' },
    { icon: User, label: 'My Profile', path: '/mahasiswa/profile' },
  ];

  return (
    <div className="w-72 bg-white border-r-4 border-black flex flex-col h-screen fixed top-0 left-0">
      <div className="p-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter font-display leading-tight">
          SAKTI
        </h1>
        <div className="mt-1 px-2 py-1 bg-black text-white text-[10px] font-black uppercase inline-block">
          {role} Panel
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center p-4 border-4 transition-all group ${isActive ? 'bg-primary text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black border-transparent hover:border-black'}`}
            >
              <item.icon className={`w-5 h-5 mr-4 ${isActive ? 'text-white' : 'group-hover:text-primary'}`} />
              <span className="font-black uppercase tracking-tight text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-4 border-black">
        <button
          onClick={() => auth.signOut()}
          className="w-full flex items-center p-4 bg-red-50 border-4 border-black text-black font-black uppercase text-sm hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-y-0 active:translate-y-1"
        >
          <LogOut className="w-5 h-5 mr-4" />
          Terminate
        </button>
      </div>
    </div>
  );
};

export const DashboardHeader = ({ title }: { title: string }) => (
  <header className="h-24 bg-white border-b-4 border-black flex items-center justify-between px-12 sticky top-0 z-10">
    <h2 className="text-3xl font-black uppercase tracking-tighter font-display italic">{title}</h2>
    <div className="flex items-center space-x-6">
      <div className="text-right">
        <p className="font-black uppercase text-[10px] leading-none mb-1">Authenticated As</p>
        <p className="font-bold text-gray-500 text-sm">{auth.currentUser?.email}</p>
      </div>
      <div className="w-12 h-12 bg-black border-4 border-black overflow-hidden flex items-center justify-center">
        <User className="text-white w-8 h-8" />
      </div>
    </div>
  </header>
);
