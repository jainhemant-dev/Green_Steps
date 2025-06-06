import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import HabitForm from './HabitForm';

import Api from '##/src/request';
import { selectToggleState } from '##/src/store/slices/applicationSlice';
import { selectMe } from '##/src/store/slices/userSlice';

export default function HabitPage({ userId = {} }) {
  const [globalHabits, setGlobalHabits] = useState([]);
  const [customHabits, setCustomHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const currentUser = useSelector(selectMe);
  const isToogleEnabled = useSelector(selectToggleState);

  async function fetchHabits() {
    const [gRes, cRes] = await Promise.all([
      Api.fetch('/api/habit/global'),
      Api.fetch(`/api/habit/custom/${currentUser?._id}`),
    ]);
    setGlobalHabits(gRes);
    setCustomHabits(cRes);
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreate = () => {
    setEditHabit(null);
    setShowForm(true);
  };
  const handleEdit = (habit) => {
    setEditHabit(habit);
    setShowForm(true);
  };
  const handleDelete = async (habitId) => {
    if (!confirm('Delete this habit?')) return;
    await Api.fetch(`/api/habit/custom/${currentUser._id}/${habitId}`);
    fetchHabits();
  };

  const handleSubmit = async (data) => {
    if (editHabit) {
      await Api.fetch(
        `/api/habit/custom/${currentUser._id}/${editHabit?._id}`,
        {
          method: 'PATCH',
          body: data,
        },
      );
    } else {
      await Api.fetch(`/api/habit/custom/${currentUser._id}`, {
        method: 'POST',
        body: data,
      });
    }
    setShowForm(false);
    fetchHabits();
  };

  return (
    <div
      className={`${
        isToogleEnabled ? 'ml-63  w-[80vw]' : 'ml-20  w-[80vw]'
      } overflow-x-hidden transition-all duration-500 p-6 min-h-screen`}
    >
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">Your Habits</h1>
        <motion.button
          onClick={handleCreate}
          whileHover={{ scale: 1.05 }}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-xl transition"
        >
          <FaPlus className="mr-2" /> New Habit
        </motion.button>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-teal-700 mb-6">
          Global Habits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalHabits.map((habit) => (
            <motion.div
              key={habit?._id}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-xl flex flex-col transition transform hover:shadow-2xl border-l-4 border-green-400"
            >
              <h3 className="text-xl font-semibold text-green-900 mb-3">
                {habit.name}
              </h3>
              <p className="text-base text-gray-600 flex-1">
                {habit.description || 'No description provided.'}
              </p>
              <div className="mt-4 text-base text-gray-700">
                <span className="font-semibold">Points:</span>{' '}
                {habit.pointsPerUnit}
                <span className="ml-4 font-semibold">CO₂:</span>{' '}
                {habit.co2PerUnit}kg
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-teal-700 mb-6">
          Your Custom Habits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!!customHabits?.length &&
            customHabits.map((habit) => (
              <motion.div
                key={habit._id}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-xl flex flex-col transition transform hover:shadow-2xl border-l-4 border-teal-400"
              >
                <h3 className="text-xl font-semibold text-green-900 mb-3">
                  {habit.name}
                </h3>
                <p className="text-base text-gray-600 flex-1">
                  {habit.description || 'No description provided.'}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-base text-gray-700">
                    <span className="font-semibold">Pts:</span>{' '}
                    {habit.pointsPerUnit}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(habit)}
                      className="text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(habit?._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {showForm && (
        <HabitForm
          initialData={editHabit}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
