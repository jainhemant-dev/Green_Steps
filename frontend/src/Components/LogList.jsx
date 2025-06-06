// components/LogList.jsx
export default function LogList({ logs = [], onPageChange }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-2xl md:ml-64 mt-6">
      <h2 className="text-xl font-semibold text-green-800 mb-4">
        Your History
      </h2>
      <ul className="space-y-3">
        {logs.map((log) => (
          <li
            key={log._id}
            className="border-l-4 border-green-300 p-3 rounded-lg"
          >
            <div className="flex justify-between">
              <span className="font-medium">{log.habit.name}</span>
              <span className="text-green-600">+{log.ecoPoints} pts</span>
            </div>
            <p className="text-gray-600 text-sm">
              {new Date(log.date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
      {/* Pagination controls here */}
    </div>
  );
}
