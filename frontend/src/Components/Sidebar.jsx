import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FaBars,
  FaChartLine,
  FaGift,
  FaHome,
  FaMedal,
  FaRegListAlt,
  FaUsers,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setToggleState } from '../store/slices/applicationSlice';

const menus = [
  { title: 'Dashboard', path: '/', icon: <FaHome /> },
  { title: 'Log Action', path: '/activity-logs', icon: <FaRegListAlt /> },
  { title: 'Visualization', path: '/visualization', icon: <FaChartLine /> },
  { title: 'Badges', path: '/badges', icon: <FaMedal /> },
  { title: 'Impact Journal', path: '/impact-journal', icon: <FaChartLine /> },
  // { title: 'Rewards', path: '/rewards', icon: <FaGift /> },
  { title: 'Community', path: '/community', icon: <FaUsers /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const dispatchToRedux = useDispatch();

  // Check screen size on mount and on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setOpen(false);
      } else {
        setIsMobile(false);
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatchToRedux(setToggleState(open));
  }, [open, dispatchToRedux]);
  // #386641 // dark green
  return (
    <div
      className={`fixed h-screen z-10 p-4 pt-8 duration-500 shadow-lg transition-all ${open
        ? 'w-64 bg-gradient-to-br from-[#188fce] to-[#193d04]'
        : 'w-20  bg-[#11719d]'
        }`}
    >
      {/* Show the toggle only on larger screens */}
      {!isMobile && (
        <FaBars
          className="absolute right-4 top-4 h-6 w-6 cursor-pointer text-white hover:scale-110 transition-transform"
          onClick={() => setOpen(!open)}
        />
      )}
      <ul className="lg:mt-10 space-y-4">
        {menus.map((m) => (
          <motion.li
            key={m.title}
            onClick={() => navigate(m.path)}
            className="flex items-center space-x-3 p-2 rounded-xl cursor-pointer text-white hover:bg-[#188ece78] transition-all shadow-md"
            whileHover={{ scale: 1.1, rotate: 3 }}
          >
            <motion.div
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              className="h-6 w-6"
            >
              {m.icon}
            </motion.div>
            {open && <span className="font-semibold">{m.title}</span>}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
