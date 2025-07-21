import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../Sidebar';
import { useState } from 'react';
import { useUser, SignIn } from '@clerk/clerk-react';
import logo from '../../assets/favicon.svg';

function Layout() {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col h-screen bg-[#F4F7FB]">
      
      {/* Top Navbar (Styled like your Navbar.jsx) */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-2xl bg-white/80 border-b border-gray-200 flex items-center justify-between px-4 sm:px-20 xl:px-32 h-16 shadow-sm">
        
        {/* Logo + Brand */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <img
            src={logo}
            alt="Mindmesh Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <h1 className="font-semibold text-2xl sm:text-2xl text-primary">
            Mindmesh<span className="text-gray-600">.ai</span>
          </h1>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebar(!sidebar)}
          className="sm:hidden p-2 rounded hover:bg-gray-100 transition"
        >
          {sidebar ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </nav>

      {/* Main Content below navbar */}
      <div className="flex pt-16 h-full">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-[#F4F7FB]">
      <SignIn />
    </div>
  );
}

export default Layout;