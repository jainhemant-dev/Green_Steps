import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';

export default function ActionLogList({ logs, onDelete, onUpdate }) {
  const [selectedLogs, setSelectedLogs] = useState({});

  const toggleSelect = (id) => {
    setSelectedLogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Recent Actions</h2>
      <ul className="divide-y mt-3">
        <AnimatePresence>
          {logs.map((log) => {
            const isSelected = selectedLogs[log._id];
            return (
              <motion.li
                key={log._id}
                className="flex justify-between items-center py-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 text-green-600">
                  {/* Left: either checkbox for incomplete or check icon for completed */}
                  {log.isCompleted ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => toggleSelect(log._id)}
                      className="w-5 h-5 text-green-600"
                    />
                  )}

                  {/* Main log text */}
                  <div className="flex flex-col">
                    <span>
                      {log.habit?.name} - {log.quantity} unit
                      {log.quantity > 1 ? 's' : ''}
                    </span>
                    <span className="text-sm text-green-600 mt-1">
                      Points Earned: {log.points} | CO₂ Saved: {log.co2Saved} kg
                    </span>
                  </div>
                </div>

                {/* Right: update button only if selected */}
                {!log.isCompleted && isSelected && (
                  <button
                    onClick={() => onUpdate(log._id)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                  >
                    Mark as Completed
                  </button>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
