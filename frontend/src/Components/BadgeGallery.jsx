// components/BadgeGallery.jsx
import { motion } from 'framer-motion';

export default function BadgeGallery({ badges = [] }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-2xl md:ml-64 mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((b) => (
        <motion.div
          key={b._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-center ${b.earned ? 'bg-emerald-100' : 'bg-gray-100'}`}
        >
          <img src={b.iconUrl} className="mx-auto h-12 w-12 mb-2" />
          <p className="text-sm font-medium text-green-800">{b.name}</p>
        </motion.div>
      ))}
    </div>
  );
}
