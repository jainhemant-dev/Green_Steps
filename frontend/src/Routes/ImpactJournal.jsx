import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { selectMe } from '../store/slices/userSlice';
import Api from '##/src/request';
import { selectToggleState } from '../store/slices/applicationSlice';
import { Link } from 'react-router-dom';
import { RiPoliceBadgeLine } from "react-icons/ri";


function EcoPointsCounter({ points }) {
    return (
        <div className="fixed top-4 right-4 bg-green-200 px-4 py-2 rounded-lg shadow-lg flex items-center">
            <span className="font-semibold text-green-800">Eco-Points: {points}</span>
        </div>
    );
}

function BadgeList({ badges }) {
    const badgesCount = badges.length;
    // console.log("badges", badges);
    return (
        <div className="p-4">

            <div className="flex flex-wrap gap-4">
                <h3 className="text-lg font-semibold text-green-700 mb-2 ">Badges Unlocked</h3>
                <Link to="/badges">
                    <motion.div
                        // key={badges._id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="flex"
                    >
                        {/* <img src={badge.icon} alt={badge.name} className="w-12 h-12" /> */}
                        <RiPoliceBadgeLine className="w-20 h-20 text-green-800" />
                        <span className="relative w-[36px] h-[36px] text-sm font-extrabold shadow-2xl -ml-14.5 mt-6
                         shadow-amber-400  text-center bg-green-800 text-amber-400 rounded-b-full">
                            <span className='absolute top-1 right-1 tracking-wider'>{badgesCount <= 9 ? "00" + badgesCount : badgesCount <= 99 ? "0" + badgesCount : badgesCount}</span>
                        </span>

                    </motion.div>
                </Link>
                {/* {badges.map(badge => (
                    
                ))} */}
            </div>
        </div>
    );
}

function DayItem({ log, isOpen, onToggle }) {
    return (
        <div className="mb-6 ml-6 relative">
            <div className="absolute -left-3 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            <div
                className="p-4 bg-green-50 rounded-lg shadow-md cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{new Date(log.date).toDateString()}</span>
                    <span className="font-semibold text-green-700">+{log.points} pts</span>
                </div>
                {log.notes && (
                    <div className="mt-1 text-sm italic text-gray-600">{log.notes}</div>
                )}
            </div>
            {isOpen && (
                <motion.div
                    className="mt-2 pl-6 p-4 bg-green-100 rounded-lg shadow-inner"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-2">
                        <div className="font-medium">Habit: {log.habit?.name || 'N/A'}</div>
                        <div className="text-sm">Quantity: {log.quantity}, CO₂ Saved: {log.co2Saved} kg</div>
                        {log.notes && <div className="text-sm text-gray-600">"{log.notes}"</div>}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default function ImpactJournal() {
    const [logs, setLogs] = useState([]);
    const [openDate, setOpenDate] = useState(null);
    const [userBadges, setUserBadges] = useState([]);
    const [ecoPoints, setEcoPoints] = useState(0);
    const isToogleEnabled = useSelector(selectToggleState);
    const user = useSelector(selectMe);
    const userId = user?._id;

    useEffect(() => {
        const fetchLogs = async () => {
            const res = await Api.fetch(`/api/user-log/user/${userId}`);
            console.log("res", res);

            setLogs(res);
        };

        // const fetchUser = async () => {
        //     const userRes = await Api.fetch(`/api/user/${userId}`);
        //     setUserBadges(userRes.badges || []);
        //     setEcoPoints(userRes.ecoPoints || 0);
        // };
        fetchLogs();
    }, []);
    console.log("user - ", user);

    return (
        <div className={`${isToogleEnabled ? 'ml-63  w-[78vw]' : 'ml-20  w-[80vw]'} overflow-x-hidden transition-all duration-500 p-6 min-h-screen`}
        >
            <EcoPointsCounter points={user.ecoPoints} />
            <BadgeList badges={user.badges} />

            <h2 className="text-2xl font-bold text-green-800 mb-4">Impact Journal</h2>
            <div className="relative border-l-2 border-green-300">
                {logs.map(log => (
                    <DayItem
                        key={log._id}
                        log={log}
                        isOpen={openDate === log._id}
                        onToggle={() => setOpenDate(openDate === log._id ? null : log._id)}
                    />
                ))}
            </div>
        </div>
    );
}
