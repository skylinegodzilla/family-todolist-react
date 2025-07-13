

// import { useState, useEffect } from 'react';
// import { type ToDoList } from './types/types'; // adjust path if needed

import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.tsx';
import ToDoListsPage from './pages/ToDoListPage/ToDoListsPage.tsx';
import ListDetailPage from './pages/ListDetailPage/ListDetailPage.tsx';
import AdminPanelPage from './pages/AdminPanelPage/AdminPanelPage.tsx';

function App() {

    return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/lists" element={<ToDoListsPage />} />
      <Route path="/lists/:listId" element={<ListDetailPage />} />
      <Route path="/admin" element={<AdminPanelPage />} />
    </Routes>
  );
}

export default App;
