import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Api from '../request';
import { selectToggleState } from '../store/slices/applicationSlice';

export default function CommunityDashboard({ stats = {}, leaderboard = [] }) {
  const [allUsers, setAllUsers] = useState([]);
  const [globalData, setGlobalData] = useState({});
  const isToogleEnabled = useSelector(selectToggleState);

  // Derive top 10 users based on ecoPoints
  const topLeaders = [...allUsers]
    .sort((a, b) => b.ecoPoints - a.ecoPoints)
    .slice(0, 10);

  useEffect(() => {
    async function hanldefetchAllUsers() {
      const [{ users }, globalstate] = await Promise.all([
        Api.fetch('/api/user/getAll'),
        Api.fetch('/api/global-log-data/globalStates'),
      ]);
      setGlobalData(globalstate);
      setAllUsers(users);
    }
    hanldefetchAllUsers();
  }, []);

  return (
    <div
      className={`${isToogleEnabled ? 'ml-63  w-[78vw]' : 'ml-20  w-[80vw]'} overflow-x-hidden transition-all duration-500 p-6 min-h-screen`}
    >
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Global Community
      </h2>

      {/* Top 10 Leaders Row */}
      <div>
        <h3 className="text-lg font-bold text-green-700 mb-2">
          Top 10 Leaders
        </h3>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {topLeaders.map((user, idx) => (
            <div
              key={idx}
              className="min-w-[180px] bg-green-50 border border-green-100 p-4 rounded-lg shadow hover:shadow-md transition transform hover:-translate-y-1 flex-shrink-0"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold">
                  {user.name?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-green-800">{user.name}</p>
                  <p className="text-xs text-gray-500">#{idx + 1}</p>
                </div>
              </div>
              <div className="text-sm text-center text-green-700 font-bold">
                {user.ecoPoints} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-green-50 p-4 rounded shadow">
            <span className="text-green-800 font-semibold">
              Total Actions Logged
            </span>
            <span className="text-green-700 font-bold">
              {globalData.totalActions}
            </span>
          </div>
          <div className="flex items-center justify-between bg-green-50 p-4 rounded shadow">
            <span className="text-green-800 font-semibold">
              Most Common Habit
            </span>
            <span className="text-green-700 font-bold">
              {globalData.commonHabit}
            </span>
          </div>
        </div>
      </div>

      {/* All Users Display */}
      <h3 className="text-lg font-bold text-green-700 mb-4">
        All GreenSteps Users
      </h3>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {allUsers.map((user, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-5 border border-green-100 transition transform hover:-translate-y-1"
          >
            {/* Profile Initials Circle */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xl font-bold">
                {user.name?.[0] || 'U'}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-800">
                  {user.name}
                </h4>
                <p className="text-sm text-gray-500">Level {user.level || 1}</p>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm text-green-900">
              <div className="bg-green-50 p-3 rounded-lg text-center shadow">
                <p className="font-bold">{user.ecoPoints}</p>
                <p className="text-xs text-gray-600">Eco Points</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center shadow">
                <p className="font-bold">{user.currentStreak} 🔥</p>
                <p className="text-xs text-gray-600">Current Streak</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center shadow col-span-2">
                <p className="font-bold">{user.longestStreak} 🌿</p>
                <p className="text-xs text-gray-600">Longest Streak</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
