import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectToggleState,
  setApplicationProcessingState,
} from '../store/slices/applicationSlice';
import { selectMe, setMe, updateUserProfile } from '../store/slices/userSlice';
import { setComponentDisplayName } from '##/src/utility/utility.js';
import { FaCamera } from 'react-icons/fa';
import { deleteFile, uploadFile } from '../utility/file.utility';
import useAPIErrorHandler from '../hooks/useAPIErrorHandling';
import { setAlertMessage } from '../store/slices/alertSlice';
import profileImg from '##/src/assets/images/profile.svg';

function UserProfile() {
  const isToggleEnabled = useSelector(selectToggleState);
  const currentUser = useSelector(selectMe);

  // Local state for editable fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatarUrl: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const handleError = useAPIErrorHandler('UserProfile');
  const dispatch = useDispatch();
  // Pre-populate form when currentUser is available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        password: '',
        avatarUrl: currentUser.profileImgLink || profileImg, // this may come from the backend
      });
    }
  }, [currentUser]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');
    try {
      const updates = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) updates.password = formData.password;
      if (formData.avatarUrl) updates.avatarUrl = formData.avatarUrl;

      await dispatch(
        updateUserProfile({ userId: currentUser._id, updates }),
      ).unwrap();
      setMessage('✅ Profile updated successfully.');
    } catch (error) {
      setMessage('❌ Error updating profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(setApplicationProcessingState('Updating profile picture...'));
      const { signedUrl } = await uploadFile(file, handleError);
      const url = signedUrl.split('?')[0];

      if (currentUser.profileImgLink) {
        await deleteFile(currentUser.profileImgLink, handleError);
      }
      await dispatch(
        updateUserProfile({
          userId: currentUser._id,
          updates: { profileImgLink: url },
        }),
      ).unwrap();
      dispatch(setAlertMessage('Profile picture uploaded successfully.'));
      dispatch(setApplicationProcessingState(false));
    }
  };

  return (
    <div
      className={`${isToggleEnabled ? 'ml-63 w-[80vw]' : 'ml-20 w-[80vw]'
        } overflow-x-hidden transition-all duration-500 p-6 min-h-screen bg-gray-50`}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10 space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative group w-24 h-24">
            <img
              src={formData.avatarUrl || '/default-avatar.png'}
              alt="User avatar"
              className="h-24 w-24 rounded-full border-4 border-green-200 shadow-md object-cover"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <FaCamera className="text-white text-2xl" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <h1 className="text-3xl font-bold text-green-800">Your Profile</h1>
          {message && (
            <p className="text-sm text-center text-green-600">{message}</p>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="text-green-800 font-medium">Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>
          <div>
            <label className="text-green-800 font-medium">Email</label>
            <input
              disabled
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none"
            />
          </div>
          {/* Optional password field */}
          {/*
          <div>
            <label className="text-green-800 font-medium">Password</label>
            <input
              name="password"
              type="password"
              placeholder="New password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>
          */}
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full py-3 rounded-xl text-white font-bold shadow-md transition ${isUpdating
                ? 'bg-green-400 opacity-50 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <hr className="my-6" />

        {/* Read-Only Profile Details */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-green-800 text-sm">
          <div className="font-semibold">Role:</div>
          <div className="text-green-700">{currentUser?.role}</div>

          <div className="font-semibold">Eco Points:</div>
          <div className="text-green-700">{currentUser?.ecoPoints}</div>

          <div className="font-semibold">Level:</div>
          <div className="text-green-700">{currentUser?.level}</div>

          <div className="font-semibold">Current Streak:</div>
          <div className="text-green-700">{currentUser?.currentStreak}</div>

          <div className="font-semibold">Longest Streak:</div>
          <div className="text-green-700">{currentUser?.longestStreak}</div>
        </div>
      </div>
    </div>
  );
}

setComponentDisplayName(UserProfile, 'UserProfile');
export default UserProfile;
