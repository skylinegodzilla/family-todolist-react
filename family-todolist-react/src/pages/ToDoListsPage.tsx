import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth'; // adjust path if needed

function ToDoListsPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <button onClick={handleLogout} style={{ float: 'right' }}>
        Logout
      </button>
      <h1>Your To-Do Lists</h1>
      {/* Your content here */}
    </div>
  );
}
export default ToDoListsPage; // allows this to be imported in to other files for things like routing