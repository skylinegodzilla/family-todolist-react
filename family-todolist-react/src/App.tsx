import { useState, useEffect } from 'react';
import { type ToDoList } from './types/types'; // adjust path if needed

function App() {
  const [todoLists, setTodoLists] = useState<ToDoList[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/todolists', {
      headers: {
        Authorization: '70apju5mduje57bts2eta6sgil' // todo: rember this is just a hardcoded token. This is not going to work beyond this first test
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
      })
      .then(data => setTodoLists(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h1>To-Do Lists</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {todoLists.map(list => (
          <li key={list.listId}>
            <strong>{list.title}</strong> – {list.description}
            <ul>
              {list.items.map(item => (
                <li key={item.itemId}>
                  {item.title} {item.completed ? '✅' : '❌'} (Due: {item.dueDate})
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
