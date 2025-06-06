import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaFireAlt, FaLeaf, FaMedal, FaStar, FaTrophy } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import Api from '../request';
import { selectToggleState } from '../store/slices/applicationSlice';
import { selectMe } from '../store/slices/userSlice';

const iconMap = {
  points: FaTrophy,
  streak: FaLeaf,
  milestone: FaMedal,
};

export default function BadgeCabinet() {
  const isToogleEnabled = useSelector(selectToggleState);
  const [allBadges, setAllBadges] = useState([]);
  const [usersBadges, setUsersBadges] = useState([]);
  const [recentBadge, setRecentBadge] = useState(null);
  const currentUser = useSelector(selectMe);

  async function fetchBadges() {
    const [gRes, cRes] = await Promise.all([
      Api.fetch('/api/badge/all'),
      Api.fetch(`/api/badge/user/${currentUser?._id}`),
    ]);
    setAllBadges(gRes);
    setUsersBadges(cRes);
  }

  useEffect(() => {
    if (currentUser?._id) fetchBadges();
  }, [currentUser]);

  const isEarned = (badgeId) => usersBadges.some((b) => b._id === badgeId);

  // On mount, scroll the container to the top

  useEffect(() => {
    const todayBadge = usersBadges.find(
      (b) =>
        new Date(b.earnedDate).toDateString() === new Date().toDateString(),
    );
    if (todayBadge) setRecentBadge(todayBadge);
  }, [usersBadges]);

  const categorized = allBadges.reduce((acc, badge) => {
    if (!acc[badge.type]) acc[badge.type] = [];
    acc[badge.type].push(badge);
    return acc;
  }, {});

  return (
    <div
      className={`${
        isToogleEnabled ? 'ml-63 w-[80vw]' : 'ml-20 w-[80vw]'
      } overflow-x-hidden transition-all duration-500 p-6 min-h-screen`}
    >
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center sm:text-left">
        Badge Cabinet
      </h2>

      {Object.entries(categorized).map(([type, badges]) => {
        const sortedBadges = badges.sort(
          (a, b) => isEarned(b._id) - isEarned(a._id),
        );

        return (
          <div key={type} className="mb-10">
            <h3 className="text-xl font-semibold text-green-800 mb-4 capitalize">
              {type} Badges
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sortedBadges.map((badge) => {
                const earned = isEarned(badge._id);
                const Icon = iconMap[badge.type] || FaStar;

                // Define variants for badge container
                const badgeVariants = earned
                  ? {
                      rest: { scale: 1, rotate: 0 },
                      hover: { scale: 1.1, rotate: 2 },
                    }
                  : {
                      rest: { scale: 1 },
                      hover: { scale: 1.03 },
                    };

                return (
                  <motion.div
                    key={badge._id}
                    className={`relative p-4 rounded-2xl shadow-md flex flex-col items-center justify-center transition-all duration-300 cursor-pointer 
                      ${
                        earned
                          ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white'
                          : 'bg-gray-100 text-green-800 opacity-80 hover:opacity-100'
                      }
                    `}
                    variants={badgeVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    {earned && (
                      <>
                        {/* Existing glow effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl z-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <div className="absolute inset-0 bg-yellow-200 opacity-30 blur-md"></div>
                          <div className="absolute inset-0 bg-yellow-400 opacity-50 filter mix-blend-screen"></div>
                        </motion.div>

                        {/* Fire spark effect on hover */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                          variants={{
                            rest: { opacity: 0, scale: 0 },
                            hover: { opacity: 1, scale: [0, 1.5, 0] },
                          }}
                          transition={{
                            duration: 0.8,
                            ease: 'easeInOut',
                            repeat: Infinity,
                          }}
                        >
                          <FaFireAlt className="text-yellow-300 text-2xl" />
                        </motion.div>
                      </>
                    )}
                    <Icon className="text-4xl mb-2 z-10" />
                    <span className="font-semibold text-center text-sm z-10">
                      {badge.name}
                    </span>
                    <p className="text-xs text-center mt-1 z-10">
                      {badge.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {recentBadge && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold text-yellow-500">Congrats! 🎉</h2>
            <p>
              You earned the <strong>{recentBadge.name}</strong> badge!
            </p>
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FaStar className="text-yellow-400 text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
            </motion.div>
            <button
              onClick={() => setRecentBadge(null)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
