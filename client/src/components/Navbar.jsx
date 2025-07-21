import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets'; // ✅ Apne logo ko yahan export kar le
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import logo from '../assets/favicon.svg'; // ✅ Make sure this path is correct

function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32">
      
      {/* 👉 Logo + Brand name */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        <img
          src={logo}
          alt="Mindmesh Logo"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
        <h1 className="font-semibold text-2xl sm:text-2xl xl:text-3xl text-primary">
          Mindmesh<span className="text-gray-600">.ai</span>
        </h1>
      </div>

      {/* 👉 Auth controls */}
      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-6 py-2 sm:px-10 sm:py-2.5"

        >
          Get started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Navbar;
