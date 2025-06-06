// components/RewardCard.jsx
export default function RewardCard({ reward = {}, onRedeem, userPoints }) {
  const affordable = userPoints >= reward.cost;
  return (
    <div className="bg-white shadow-lg p-4 rounded-2xl flex flex-col items-center space-y-2">
      <h3 className="text-lg font-semibold text-green-800">{reward.name}</h3>
      <p className="text-gray-600 text-sm">{reward.description}</p>
      <button
        disabled={!affordable}
        onClick={() => onRedeem(reward._id)}
        className={`mt-auto py-2 px-4 rounded-xl font-medium ${
          affordable
            ? 'bg-amber-400 hover:bg-amber-500 text-white'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        Redeem ({reward.cost} pts)
      </button>
    </div>
  );
}
