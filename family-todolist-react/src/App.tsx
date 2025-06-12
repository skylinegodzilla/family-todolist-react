

// import { useState, useEffect } from 'react';
// import { type ToDoList } from './types/types'; // adjust path if needed

import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage.tsx';
import ToDoListsPage from './pages/ToDoListsPage.tsx';
import ListDetailPage from './pages/ListDetailPage.tsx';
import AdminPage from './pages/AdminPage.tsx';

function App() {
  // TODO: this is all old code from the poc keping it as it might be usefull for learning from till i get better at react
  // const [todoLists, setTodoLists] = useState<ToDoList[]>([]); // creating a state to hold the todolist useState<ToDoList[]>, The default value is an empty list ([]);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetch('/api/todolists', {
  //     headers: {
  //       Authorization: '70apju5mduje57bts2eta6sgil' // todo: rember this is just a hardcoded token. This is not going to work beyond this first test
  //     }
  //   })
  //     .then(res => {
  //       if (!res.ok) throw new Error(`Server error ${res.status}`);
  //       return res.json();
  //     })
  //     .then(data => setTodoLists(data))
  //     .catch(err => setError(err.message));
  // }, []);

  // return (
  //   <div>
  //     <h1>To-Do Lists</h1>
  //     {error && <p style={{ color: 'red' }}>{error}</p>}
  //     <ul>
  //       {todoLists.map(list => (
  //         <li key={list.listId}>
  //           <strong>{list.title}</strong> – {list.description}
  //           <ul>
  //             {list.items.map(item => (
  //               <li key={item.itemId}>
  //                 {item.title} {item.completed ? '✅' : '❌'} (Due: {item.dueDate})
  //               </li>
  //             ))}
  //           </ul>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );


    return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/lists" element={<ToDoListsPage />} />
      <Route path="/lists/:listId" element={<ListDetailPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
