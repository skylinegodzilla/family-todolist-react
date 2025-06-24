import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  /* 
    useState hooks create state variables that React "remembers" between renders. 
    Here we create state for username, password, and error message, all starting empty.
  */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // useNavigate gives us a function that we can call to programmatically change the page.
  const navigate = useNavigate();

  /*
    handleLogin is an async function triggered when the login form is submitted.
    The 'e' is the event object representing the form submission event.
    e.preventDefault() stops the browser from refreshing the page automatically.
  */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      /*
        We send a POST request to the backend /api/auth/login endpoint with username and password.
        'await' pauses the function until fetch returns a response.
        The request body must be JSON, so we convert the data with JSON.stringify.
      */
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      /*
        If the server response status isn't OK (like 200), we throw an error
        so the catch block below can handle it.
      */
      if (!response.ok) throw new Error('Login failed');

      /*
        We wait for the response body to be parsed from JSON into a JavaScript object.
        The curly braces around sessionToken means we are extracting just the sessionToken
        property from the response object (called destructuring).
      */
      //const { sessionToken } = await response.json();

      const data = await response.json();

      // Temporarily save the sessionToken in sessionStorage (cleared on browser close).
      sessionStorage.setItem('sessionToken', data.token);
      sessionStorage.setItem("username", username);
      //       sessionStorage.setItem('userId', data.userId); TODO: may need this may not. alot of the athentacation of lists should be done on backend with the session token to assing list to users but we will see

      // Redirect user to the /lists page after successful login.
      navigate('/lists');
    } catch (err: unknown) {
      /*
        In case of error, we check if 'err' is an actual Error object.
        If yes, we display its message; otherwise, we show a generic message.
      */
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
    }
  };

  return (
    <div className="center-page">
      <div className="page">
        <h2>Family Checklist</h2>
      </div>
      <div className="page">
        <h1>Login</h1>
        {/* 
          The form element listens for submit events and calls handleLogin when submitted.
          Inputs update their respective state values on every keystroke using onChange handlers.
        */}
        <form onSubmit={handleLogin}>
          <label className="gradient-label">
            Username:
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="gradient-label">
            Password:
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>

          {/* Error message placeholder */}
          <p className="error-message" aria-live="assertive">
            {error || '\u00A0' /* non-breaking space to keep height */}
          </p>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
