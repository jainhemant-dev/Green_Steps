import { setComponentDisplayName } from '##/src/utility/utility.js';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useAPIErrorHandler from '##/src/hooks/useAPIErrorHandling.js';
import { setAlertMessage } from '##/src/store/slices/alertSlice.js';
import Api from '##/src/request.js';
import { setMe } from '##/src/store/slices/userSlice.js';
import { setAuthenticated } from '##/src/store/slices/authSlice.js';
import {  setApplicationProcessingState } from '##/src/store/slices/applicationSlice.js';
import { useNavigate } from 'react-router-dom';

function RegisterForm({ onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const dispatchToRedux = useDispatch();
  const handleError = useAPIErrorHandler('RegisterForm');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatchToRedux(setApplicationProcessingState('Registering user...'));
    try {
      await Api.fetch('/api/auth/register', {
        method: 'POST',
        body: form,
      });

      dispatchToRedux(setAlertMessage('Registration successful.'));
      dispatchToRedux(setApplicationProcessingState(false));
      navigate('/login');
    } catch (err) {
      dispatchToRedux(setApplicationProcessingState(false));
      setError(err.response?.data?.error || 'Registration failed');
      handleError('handleSubmit', err, 'Failed to Registration');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Join GreenSteps 🌱
        </h2>
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-xl border border-green-300"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-xl border border-green-300"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 p-3 rounded-xl border border-green-300"
          required
        />
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl"
        >
          Register
        </button>
        <button
          onClick={() => {
            navigate('/login');
          }}
          className="w-full py-3 text-green-500 cursor-pointer font-bold rounded-xl"
        >
          Already Registered? Login
        </button>
      </form>
    </div>
  );
}

setComponentDisplayName(RegisterForm, 'RegisterForm');
export default RegisterForm;
