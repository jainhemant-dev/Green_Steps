import { Route, Routes } from 'react-router-dom';

import Can from '##/src/Components/can/Can.jsx';
import RedirectRoute from '##/src/Components/can/RedirectRoute.jsx';
import lazyLoad from '##/src/LazyLoader.jsx';
import { setComponentDisplayName } from '##/src/utility/utility.js';

const AdminDashboard = lazyLoad(
  () => import('##/src/Routes/AdminDashboard.jsx'),
);
const UserDashBoard = lazyLoad(() => import('##/src/Routes/UserDashBoard.jsx'));
const Signup = lazyLoad(() => import('##/src/Routes/Signup.jsx'));
const Login = lazyLoad(() => import('##/src/Routes/Login.jsx'));
const Rewards = lazyLoad(() => import('##/src/Routes/Rewards.jsx'));
const Badges = lazyLoad(() => import('##/src/Routes/Badges.jsx'));
const ImpactJournal = lazyLoad(() => import('##/src/Routes/ImpactJournal.jsx'));
const History = lazyLoad(() => import('##/src/Routes/History.jsx'));
const ActionLog = lazyLoad(() => import('##/src/Routes/ActionLog.jsx'));
const Community = lazyLoad(() => import('##/src/Routes/Community.jsx'));
const Profile = lazyLoad(() => import('##/src/Routes/Profile.jsx'));

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          //initially yes:()=> <UserDashboard />
          yes: () => <UserDashBoard />,
          perform: 'user-dashboard-visit',
        })}
      />
      <Route
        path="/activity-logs"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          //initially yes:()=> <UserDashboard />
          yes: () => <ActionLog />,
          perform: 'user-action-log-visit',
        })}
      />
      <Route
        path="/profile"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          //initially yes:()=> <UserDashboard />
          yes: () => <Profile />,
          perform: 'user-profile-visit',
        })}
      />
      <Route
        path="/visualization"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          //initially yes:()=> <UserDashboard />
          yes: () => <History />,
          perform: 'user-history-log-visit',
        })}
      />
      <Route
        path="/badges"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          //initially yes:()=> <UserDashboard />
          yes: () => <Badges />,
          perform: 'user-badges-log-visit',
        })}
      />
      <Route
        path="/impact-journal"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          //initially yes:()=> <UserDashboard />
          yes: () => <ImpactJournal />,
          perform: 'impact-journal-visit',
        })}
      />

      <Route
        path="/rewards"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          //initially yes:()=> <UserDashboard />
          yes: () => <Rewards />,
          perform: 'user-rewards-log-visit',
        })}
      />
      <Route
        path="/community"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          //initially yes:()=> <UserDashboard />
          yes: () => <Community />,
          perform: 'user-community-visit',
        })}
      />
      <Route
        path="/admin-dashboard"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          yes: () => <AdminDashboard />,
          perform: 'admin-dashboard-visit',
        })}
      />
      <Route
        path="/signup"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          yes: () => <Signup />,
          perform: 'sign-up:visit',
        })}
      />
      <Route
        path="/login"
        loader={async () => ({ Component: Can })}
        element={Can({
          no: () => <RedirectRoute />,
          yes: () => <Login />,
          perform: 'sign-in:visit',
        })}
      />
    </Routes>
  );
}

setComponentDisplayName(AppRoutes, 'Alert');
export default AppRoutes;
