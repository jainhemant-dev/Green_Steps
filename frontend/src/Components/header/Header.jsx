import { useState } from 'react';
import { logoutUser } from '##/src/utility/auth';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import profileImg from '##/src/assets/images/profile.svg';

export default function Header({ user = {} }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <header className="w-full sticky z-10 top-0 flex justify-between items-center bg-white shadow-md p-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-green-800">
          𝔾ℝ𝔼𝔼ℕ
          <span className=' text-xs text-green-500 '> 🇸​​</span>
          <span className=' text-sm text-green-500 '> ​🇹</span>
          <span className=' text-lg text-green-500 '> ​​🇪​</span>
          <span className=' text-xl text-green-500 '> 🇵​​​</span>
          <span className=' text-2xl text-green-500 '> 🇸</span>
        </h1>
        <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full shadow-sm">
          <span className="font-semibold text-green-700">{user.ecoPoints}</span>
          <span className="text-green-600 text-lg">єρ</span>
        </div>
      </div>

      <div className="flex items-center space-x-4 relative">
        <FaBell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-green-600 transition-transform hover:scale-110" />

        <div className="relative">
          <img
            src={user.profileImgLink || profileImg}
            alt="User avatar"
            className="h-8 w-8 rounded-full border border-green-300 shadow-sm cursor-pointer"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-20"
              onMouseLeave={closeDropdown}
            >
              <ul>
                <li className="px-4 py-2 text-gray-700 border-b border-gray-200">
                  {user.name}
                </li>
                <li
                  className="px-4 py-2 text-gray-700 hover:bg-green-50 cursor-pointer border-b border-gray-200"
                  onClick={() => {
                    navigate('/profile');
                    closeDropdown();
                  }}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 text-gray-700 hover:bg-green-50 cursor-pointer"
                  onClick={() => {
                    logoutUser();
                    closeDropdown();
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
