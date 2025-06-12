import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth'; // adjust path if needed

function ToDoListsPage() {
  const navigate = useNavigate();

  const handleLogout = () => { // defining the callback or closure or lambda or whatever this is called for the logout button. Ok it is a call back
    logout(); // call logout from the auth services file
    navigate('/login'); // use the navagate from the router we created to go to /login
  };

  return (
    // this is all HTML stuff down here nothing new
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