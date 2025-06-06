// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { selectMe } from '../store/slices/userSlice';
// import { selectToggleState } from '../store/slices/applicationSlice';
// import Api from '../request';
// import { Line, Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   ArcElement,
//   Tooltip,
//   Legend,
// );

// export default function ImpactDashboard() {
//   const currentUser = useSelector(selectMe);
//   const isToogleEnabled = useSelector(selectToggleState);
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     if (currentUser?._id) {
//       Api.fetch(`/api/user-log/user/${currentUser._id}`).then(setLogs);
//     }
//   }, [currentUser]);

//   const pointsByDate = {};
//   const habitCountMap = {};
//   let totalPoints = 0;
//   let totalCO2 = 0;

//   logs.forEach((log) => {
//     const dateStr = new Date(log.date).toLocaleDateString();
//     pointsByDate[dateStr] = (pointsByDate[dateStr] || 0) + log.points;
//     habitCountMap[log.habit.name] =
//       (habitCountMap[log.habit.name] || 0) + log.quantity;
//     totalPoints += log.points;
//     totalCO2 += log.co2Saved;
//   });

//   const lineData = {
//     labels: Object.keys(pointsByDate),
//     datasets: [
//       {
//         label: 'Eco-Points Over Time',
//         data: Object.values(pointsByDate),
//         fill: false,
//         backgroundColor: '#34D399',
//         borderColor: '#10B981',
//       },
//     ],
//   };

//   const pieData = {
//     labels: Object.keys(habitCountMap),
//     datasets: [
//       {
//         label: 'Habit Distribution',
//         data: Object.values(habitCountMap),
//         backgroundColor: [
//           '#34D399',
//           '#6EE7B7',
//           '#A7F3D0',
//           '#10B981',
//           '#059669',
//           '#047857',
//         ],
//       },
//     ],
//   };

//   return (
//     <div
//       className={`${isToogleEnabled ? 'ml-63' : 'ml-20'} w-[80vw] p-6 min-h-screen`}
//     >
//       <h2 className="text-2xl font-bold text-green-700 mb-6">My Eco Impact</h2>
//       <div className="grid md:grid-cols-2 gap-6 mb-10">
//         <div className="bg-white p-6 rounded-2xl shadow-lg">
//           <h3 className="text-lg font-semibold mb-2">
//             Total Eco-Points Earned
//           </h3>
//           <p className="text-3xl font-bold text-green-700">
//             {totalPoints.toFixed(2)}
//           </p>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow-lg">
//           <h3 className="text-lg font-semibold mb-2">Total CO₂ Saved</h3>
//           <p className="text-3xl font-bold text-green-700">
//             {totalCO2.toFixed(2)} kg
//           </p>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
//         <h3 className="text-xl font-semibold text-green-800 mb-4">
//           Eco-Points Over Time
//         </h3>
//         <Line data={lineData} />
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow-lg">
//         <h3 className="text-xl font-semibold text-green-800 mb-4">
//           Most Performed Habits
//         </h3>
//         <Pie data={pieData} />
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMe } from '../store/slices/userSlice';
import { selectToggleState } from '../store/slices/applicationSlice';
import Api from '../request';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
);

export default function ImpactDashboard() {
  const currentUser = useSelector(selectMe);
  const isToogleEnabled = useSelector(selectToggleState);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (currentUser?._id) {
      Api.fetch(`/api/user-log/user/${currentUser._id}`).then(setLogs);
    }
  }, [currentUser]);

  // Calculation containers
  const pointsByDate = {};
  const habitCountMap = {};
  let totalPoints = 0;
  let totalCO2 = 0;

  // For weekly metrics (last 7 days, including today)
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 6); // last 7 days
  let weeklyTotalPoints = 0;

  logs.forEach((log) => {
    const logDate = new Date(log.date);

    const dateStr = logDate.toLocaleDateString();
    pointsByDate[dateStr] = (pointsByDate[dateStr] || 0) + log.points;
    // log.habit.name is assumed to be available
    habitCountMap[log.habit.name] =
      (habitCountMap[log.habit.name] || 0) + log.quantity;
    totalPoints += log.points;
    totalCO2 += log.co2Saved;

    // Check if the log falls within the last 7 days (inclusive)
    if (logDate >= weekAgo && logDate <= now) {
      weeklyTotalPoints += log.points;
    }
  });

  // Today's points from logs (by today's date)
  const todayStr = new Date().toLocaleDateString();

  const todaysPoints = pointsByDate[todayStr] || 0;

  // Prepare Line Chart data: sort labels chronologically
  const sortedDates = Object.keys(pointsByDate).sort(
    (a, b) => new Date(a) - new Date(b),
  );
  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Daily Eco‑Points',
        data: sortedDates.map((date) => pointsByDate[date]),
        fill: false,
        backgroundColor: '#34D399',
        borderColor: '#10B981',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Prepare Pie Chart data
  const pieData = {
    labels: Object.keys(habitCountMap),
    datasets: [
      {
        label: 'Habit Distribution',
        data: Object.values(habitCountMap),
        backgroundColor: [
          '#34D399',
          '#6EE7B7',
          '#A7F3D0',
          '#10B981',
          '#059669',
          '#047857',
        ],
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 2,
      },
    ],
  };

  return (
    <div
      className={`${
        isToogleEnabled ? 'ml-63' : 'ml-20'
      } w-[80vw] p-6 min-h-screen `}
    >
      <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center">
        My Eco Impact
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-bold mb-2 text-green-700">
            Today's Eco‑Points
          </h3>
          <p className="text-4xl font-extrabold text-green-600">
            {todaysPoints.toFixed(2)}
          </p>
        </div>
        <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-bold mb-2 text-green-700">
            This Week's Eco‑Points
          </h3>
          <p className="text-4xl font-extrabold text-green-600">
            {weeklyTotalPoints.toFixed(2)}
          </p>
        </div>
        <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-bold mb-2 text-green-700">
            Total CO₂ Saved
          </h3>
          <p className="text-4xl font-extrabold text-green-600">
            {totalCO2.toFixed(2)} kg
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            Daily Eco‑Points Over Time
          </h3>
          <div style={{ height: 300 }}>
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            Most Performed Habits
          </h3>
          <div style={{ height: 300 }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}
