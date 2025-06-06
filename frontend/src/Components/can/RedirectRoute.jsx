import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { USER_ROLES } from '##/shared/directory.js';
import Can from '##/src/Components/can/Can.jsx';
import { selectAuthenticated } from '##/src/store/slices/authSlice.js';
import { selectMe } from '##/src/store/slices/userSlice.js';

const pageToPermissionMap = {
  '/': 'user-dashboard-visit',
  '/admin-dashboard': 'admin-dashboard-visit',
};

const customHomePage = {
  [USER_ROLES.user]: '/',
  [USER_ROLES.admin]: '/admin-dashboard',
};

function RouteRedirectFallback() {
  return <Navigate replace to={'/login'} />;
}

export default function RedirectRoute() {
  const isAuthenticated = useSelector(selectAuthenticated);
  const user = useSelector(selectMe);

  if (!isAuthenticated && !user) {
    return <RouteRedirectFallback />;
  }
  const isAdminUser = user?.role === USER_ROLES.admin;
  const isUser = user?.role === USER_ROLES.user;

  if (isAdminUser) {
    return (
      <Can
        no={() => <RouteRedirectFallback />}
        perform={pageToPermissionMap[customHomePage[USER_ROLES.admin]]}
        yes={() => <Navigate replace to={customHomePage[USER_ROLES.admin]} />}
      />
    );
  }

  if (isUser) {
    return (
      <Can
        no={() => <RouteRedirectFallback />}
        perform={pageToPermissionMap[customHomePage[USER_ROLES.user]]}
        yes={() => <Navigate replace to={customHomePage[USER_ROLES.user]} />}
      />
    );
  }
  return <RouteRedirectFallback />;
}
