// components/CommunityStats.jsx
export default function CommunityStats({ stats = { leaderboard: [] } }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-2xl md:ml-64 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          Global Progress
        </h2>
        <p className="text-gray-700">
          Total Actions:{' '}
          <span className="font-medium">{stats.totalActions}</span>
        </p>
        <p className="text-gray-700">
          Top Habit: <span className="font-medium">{stats.topHabit}</span>
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          Leaderboard
        </h2>
        <ul className="space-y-2">
          {stats.leaderboard.map((u, i) => (
            <li key={u.userId} className="flex justify-between">
              <span>
                {i + 1}. {u.username}
              </span>
              <span className="text-green-600">{u.points}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
