
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.tsx';
import ToDoListsPage from './pages/ToDoListPage/ToDoListsPage.tsx';
import ListDetailPage from './pages/ListDetailPage/ListDetailPage.tsx';
import AdminPanelPage from './pages/AdminPanelPage/AdminPanelPage.tsx';

import { useCurrentUser } from "./hooks/useCurrentUser";

// Wrap this inside your App component
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { role, loading } = useCurrentUser();

if (loading) {
  return <p>Loading...</p>;
}

if (role !== "ADMIN") {
  return <Navigate to="/lists" replace />;
}

  return <>{children}</>;
}

function App() {

    return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/lists" element={<ToDoListsPage />} />
      <Route path="/lists/:listId" element={<ListDetailPage />} />
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminPanelPage /> 
        </ProtectedAdminRoute>
      } />
    </Routes>
  );
}

export default App;
