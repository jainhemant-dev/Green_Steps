import { setComponentDisplayName } from '##/src/utility/utility.js';
import HabitPage from '../Components/habit/HabitComponentsContainer';

function UserDashBoard() {
  return (
    <div>
      <HabitPage />
    </div>
  );
}

setComponentDisplayName(UserDashBoard, 'UserDashBoard');
export default UserDashBoard;
