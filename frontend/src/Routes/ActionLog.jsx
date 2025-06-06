import { setComponentDisplayName } from '##/src/utility/utility.js';
import ActionLogger from '../Components/actionLogger/CreateAndEdit';
import Api from '##/src/request';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMe } from '../store/slices/userSlice';
import ActionLogList from '../Components/actionLogger/ActionLogList';
import { selectToggleState, setApplicationProcessingState } from '../store/slices/applicationSlice';
import { motion } from 'framer-motion';
import useAPIErrorHandler from '../hooks/useAPIErrorHandling';

function ActionLogManager() {
  const [globalHabits, setGlobalHabits] = useState([]);
  const [customHabits, setCustomHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const user = useSelector(selectMe);
  const userId = user._id;
  const isToogleEnabled = useSelector(selectToggleState);
  const dispatch = useDispatch();
  const handleError = useAPIErrorHandler('ActionLogManager');

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await Api.fetch(`/api/user-log/user/${userId}`);
      setLogs(response);
    };
    if (userId) {
      fetchLogs();
    }
  }, [userId]);

  async function fetchHabits() {
    const [gRes, cRes] = await Promise.all([
      Api.fetch('/api/habit/global'),
      Api.fetch(`/api/habit/custom/${user?._id}`),
    ]);
    setGlobalHabits(gRes);
    setCustomHabits(cRes);
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleLogSubmit = async (data) => {
    dispatch(setApplicationProcessingState('Adding Action...'));

    try {
      const newLog = await Api.fetch(`/api/log/${userId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setLogs([...logs, newLog]);
    } catch (error) {
      handleError('handleLogSubmit', error, 'Failed to add new log');
    } finally {
      dispatch(setApplicationProcessingState(false));
    }
  };

  const handleDelete = async (logId) => {
    if (!confirm('Delete this habit?')) return;
    await Api.fetch(`/api/log/${userId}/${logId}`, {
      method: 'DELETE',
    });
    setLogs(logs.filter((log) => log._id !== logId));
  };

  async function updateListItem(logId) {
    const newLog = await Api.fetch(`/api/update/log/${logId}`, {
      method: 'PATCH',
    });
    setLogs(
      logs.map((log) => {
        if (log._id === newLog._id) {
          return newLog;
        }
        return log;
      }),
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isToogleEnabled ? 'ml-63 w-[78vw]' : 'ml-20 w-[80vw]'
        } overflow-x-hidden transition-all duration-500 p-6 min-h-screen`}
    >
      <ActionLogger
        onSubmit={handleLogSubmit}
        habits={[...globalHabits, ...customHabits]}
      />
      <div className="mt-8">
        <ActionLogList
          logs={logs}
          onDelete={handleDelete}
          onUpdate={updateListItem}
        />
      </div>
    </motion.div>
  );
}

setComponentDisplayName(ActionLogManager, 'ActionLogManager');
export default ActionLogManager;
