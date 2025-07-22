import { useEffect, useState } from "react";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import type { UserRole } from "../../types/types";
import Header from "../../components/Header";
import "./AdminPanelPage.css";

const ALL_ROLES: UserRole[] = ["USER", "ADMIN"];

const AdminPanelPage: React.FC = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
    changeUserRole,
    resetUserPassword,
  } = useAdminUsers();

  const [search, setSearch] = useState("");
  const selfUsername = sessionStorage.getItem("username");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (username: string) => {
    if (window.confirm(`Delete user "${username}"? This cannot be undone.`)) {
      try {
        await deleteUser(username);
      } catch (err) {
        if (err instanceof Error) alert(err.message);
        else alert("Failed to delete user.");
      }
    }
  };

  const handleRoleChange = async (username: string, newRole: UserRole) => {
    if (
      window.confirm(
        `Change role for "${username}" to ${newRole}?`
      )
    ) {
      try {
        await changeUserRole(username, newRole);
      } catch (err) {
        if (err instanceof Error) alert(err.message);
        else alert("Failed to change user role.");
      }
    }
  };

  const handleResetPassword = async (username: string) => {
    if (
      window.confirm(
        `Reset password for "${username}"? The new password will be shown once.`
      )
    ) {
      try {
        const res = await resetUserPassword(username);
        window.prompt(
          `New password for "${username}":`,
          res.newPassword
        );
      } catch (err) {
        if (err instanceof Error) alert(err.message);
        else alert("Failed to reset password.");
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header title={"Admin Panel"} />
      <div className="todo-container admin-panel-container">
        <div className="admin-panel-content">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-search-input"
          />
          {loading && <p className="todo-loading">Loading users...</p>}
          {error && <p className="todo-error">⚠️ {error}</p>}
          <div className="admin-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      No users found.
                    </td>
                  </tr>
                )}
                {filteredUsers.map((u) => {
                  const isSelf = selfUsername === u.username;
                  const isAdmin = u.role === "ADMIN";
                  return (
                    <tr
                      key={u.username}
                      className={isAdmin ? "admin-row-highlight" : ""}
                    >
                      <td>
                        {u.username}
                        {isSelf && <span className="admin-self-note"> (You)</span>}
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={e =>
                            handleRoleChange(u.username, e.target.value as UserRole)
                          }
                          disabled={isSelf}
                        >
                          {ALL_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="defaultNoButton"
                          onClick={() => handleDelete(u.username)}
                          disabled={isSelf}
                        >
                          Delete
                        </button>
                        <button
                          className="defaultSecondaryButton"
                          onClick={() => handleResetPassword(u.username)}
                        >
                          Reset Password
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanelPage;