import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import "./LoginPage.css";

function LoginPage() {
  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Show register popup modal
  const [showRegister, setShowRegister] = useState(false);

  const {
    login,
    loginError,
    loginLoading,
    register,
    registerError,
    registerLoading,
  } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username.trim(), password);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register(regUsername.trim(), regEmail.trim(), regPassword);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="center-page">
      <div className="page" style={{ maxWidth: 400, textAlign: "center" }}>
        <h2>Family Checklist</h2>
        <small>
          bencawley &copy; {currentYear} -{" "}
          <a
            href="http://localhost:8080/swagger-ui/index.html" // TODO: change to actual url when deployed insted of localhost
            target="_blank"
            rel="noreferrer"
          >
            Swagger Docs
          </a>
        </small>
      </div>

      <div className="page">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <label className="gradient-label">
            Username:
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loginLoading}
            />
          </label>

          <label className="gradient-label">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loginLoading}
            />
          </label>

          <p className="error-message" aria-live="assertive">
            {loginError || "\u00A0"}
          </p>

          <div className="buttonRow">
            <button className="defaultPrimaryButton" type="submit" disabled={loginLoading}>
              {loginLoading ? "Logging in..." : "Login"}
            </button>
            <button className="defaultSecondaryButton" type="button" onClick={() => setShowRegister(true)}>
              Create Account
            </button>
          </div>
        </form>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="todo-modal-overlay">
          <div
            className="todo-modal-form"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
                disabled={registerLoading}
                autoFocus
              />

              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                disabled={registerLoading}
              />

              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                disabled={registerLoading}
              />

              <p className="error-message" aria-live="assertive">
                {registerError || "\u00A0"}
              </p>

              <div className="todo-modal-buttons">
                <button
                  type="submit"
                  className="defaultPrimaryButton"
                  disabled={registerLoading}
                >
                  {registerLoading ? "Creating..." : "Create Account"}
                </button>

                <button
                  type="button"
                  className="defaultNoButton"
                  disabled={registerLoading}
                  onClick={() => setShowRegister(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
