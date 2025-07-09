export type ToDoItem = {
  itemId: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string; // todo: If you later want to parse this into a Date, we can update this.
};

export type ToDoList = {
  listId: number;
  title: string;
  description: string;
  items: ToDoItem[];
};

export type ToDoItemRequestDTO = {
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
};