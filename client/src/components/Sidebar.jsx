import React from 'react';
import { useUser, useClerk, Protect } from '@clerk/clerk-react';
import {
  House, SquarePen, Hash, Image, Eraser, Scissors, FileText, Users, LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
];

function Sidebar({ sidebar, setSidebar }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <>
      {/* Overlay that blocks background when sidebar is open on mobile */}
      {sidebar && (
        <div
          onClick={() => setSidebar(false)}
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
        />
      )}

      <div
        className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center
          max-sm:fixed max-sm:top-14 max-sm:bottom-0 max-sm:z-50
          ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
          transition-all duration-300 ease-in-out overflow-y-auto`}
      >
        {/* Top section */}
        <div className="my-7 w-full">
          <img
            src={user?.imageUrl}
            alt="User avatar"
            className="w-12 rounded-full mx-auto cursor-pointer"
            onClick={() => openUserProfile()}
          />
          <h1 className="mt-1 text-center">{user?.fullName}</h1>

          <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white'
                      : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom profile + logout section */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 w-full">
          <div
            onClick={openUserProfile}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={user?.imageUrl}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-sm font-medium text-gray-800">{user?.fullName}</h1>
              <p className="text-xs text-gray-500">
                <Protect plan="premium" fallback="Free">Premium</Protect>
              </p>
            </div>
          </div>

          <LogOut
            onClick={signOut}
            className="w-5 h-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
            aria-label="Sign Out"
          />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
