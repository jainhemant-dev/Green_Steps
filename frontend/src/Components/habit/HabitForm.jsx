import { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function HabitForm({ initialData = {}, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    pointsPerUnit: '',
    co2PerUnit: '',
  });

  useEffect(() => {
    if (initialData)
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        pointsPerUnit: initialData.pointsPerUnit || '',
        co2PerUnit: initialData.co2PerUnit || '',
      });
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-20 backdrop-blur-xs bg-opacity-1 flex items-center justify-center p-4">
      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-green-800">
          {initialData?._id ? 'Edit Habit' : 'New Habit'}
        </h2>
        <input
          name="name"
          placeholder="Habit Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-green-200 rounded-xl focus:border-green-400"
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 border border-green-200 rounded-xl focus:border-green-400"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            name="pointsPerUnit"
            type="number"
            step="0.1"
            max={2}
            placeholder="Points per unit"
            value={form.pointsPerUnit}
            onChange={handleChange}
            required
            className="w-full p-3 border border-green-200 rounded-xl focus:border-green-400"
          />
          <input
            name="co2PerUnit"
            type="number"
            step="0.1"
            max={2}
            placeholder="CO₂ per unit"
            value={form.co2PerUnit}
            onChange={handleChange}
            className="w-full p-3 border border-green-200 rounded-xl focus:border-green-400"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <FaTimes /> <span>Cancel</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
            type="submit"
          >
            <FaSave className="mr-2" /> Save
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
