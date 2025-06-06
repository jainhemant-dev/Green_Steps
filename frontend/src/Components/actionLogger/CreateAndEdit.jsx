import { useState } from 'react';
import { FaLeaf, FaSave } from 'react-icons/fa';

export default function ActionLogger({ onSubmit, defaultValues, habits }) {
  const [formData, setFormData] = useState(
    defaultValues || {
      habitId: '',
      quantity: 1,
      date: new Date().toISOString().split('T')[0],
      note: '',
    },
  );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-green-700 flex items-center space-x-2 mb-4">
        <FaLeaf className="text-green-500" /> Log Your Action
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
          setFormData({
            habitId: '',
            quantity: 1,
            date: new Date().toISOString().split('T')[0],
            note: '',
          });
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Habit
          </label>
          <select
            name="habitId"
            value={formData.habitId}
            onChange={handleChange}
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:border-green-600 transition-colors"
          >
            <option value="">{'Select'}</option>
            {habits?.map((habit) => (
              <option value={habit._id} key={habit._id}>
                {habit.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:border-green-600 transition-colors"
          />
        </div>
        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:border-green-600 transition-colors"
          />
        </div>
        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Notes (optional)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:border-green-600 transition-colors"
            rows="3"
            placeholder="Add any additional details about your action..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center w-full"
        >
          <FaSave className="mr-2" /> Save Action
        </button>
      </form>
    </div>
  );
}
