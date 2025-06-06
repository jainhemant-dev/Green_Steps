import { useState } from 'react';

import { setComponentDisplayName } from '##/src/utility/utility.js';
import { useDispatch } from 'react-redux';
import useAPIErrorHandler from '##/src/hooks/useAPIErrorHandling.js';
import { setAlertMessage } from '##/src/store/slices/alertSlice.js';
import Api from '##/src/request.js';
import { setMe } from '##/src/store/slices/userSlice.js';
import { setAuthenticated } from '##/src/store/slices/authSlice.js';
import { setApplicationProcessingState } from '##/src/store/slices/applicationSlice.js';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const dispatchToRedux = useDispatch();
  const handleError = useAPIErrorHandler('LoginForm');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatchToRedux(setApplicationProcessingState('Singin in...'));
    try {
      const { user } = await Api.fetch('/api/auth/login', {
        method: 'POST',
        body: form,
      });
      dispatchToRedux(setMe(user));
      dispatchToRedux(setAuthenticated(true));
      dispatchToRedux(setAlertMessage('Logged In successfully.'));
      dispatchToRedux(setApplicationProcessingState(false));
    } catch (err) {
      dispatchToRedux(setApplicationProcessingState(false));
      setError(err.response?.data?.error || 'Login failed');
      handleError('handleSubmit', err, 'failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Welcome Back 🌱
        </h2>
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
          Login
        </button>
        <button
          onClick={() => {
            navigate('/signup');
          }}
          className="w-full py-3 text-green-500 cursor-pointer font-bold rounded-xl"
        >
          Don't have an account ? Signup
        </button>
      </form>
    </div>
  );
}

setComponentDisplayName(LoginForm, 'LoginForm');
export default LoginForm;
