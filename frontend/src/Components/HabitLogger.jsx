// components/HabitLogger.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HabitLogger({ habits = [], onSubmit }) {
  const [selected, setSelected] = useState('');
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white shadow-lg p-6 rounded-2xl md:ml-64 mt-4 space-y-4"
    >
      <h2 className="text-xl font-semibold text-green-800">Log Your Action</h2>
      <select
        className="w-full p-3 border border-green-200 rounded-xl"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        required
      >
        <option value="">Select a habit</option>
        {habits.map((h) => (
          <option key={h._id} value={h._id}>
            {h.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        className="w-full p-3 border border-green-200 rounded-xl"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        required
      />
      <textarea
        rows="3"
        className="w-full p-3 border border-green-200 rounded-xl"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
        type="submit"
      >
        Submit
      </motion.button>
    </form>
  );
}
