// Data types for the Family To-Do List application
// todo: check if these types are used in the codebase and remove unused ones
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

// Admin-related types
export type UserRole = "USER" | "ADMIN";

export interface AdminUserSummary {
  username: string;
  email: string;
  role: UserRole;
}

// Added this so that in the event that the detail endpoint adds more fields later we dont need to update the codebase
// insted we can just add the new fields to the AdminUserDetail type.
// so for now we are just saying that it is the same as AdminUserSummary but in the future it can be extended.
export type AdminUserDetail = AdminUserSummary;

export interface AdminApiMessage {
  message: string;
}

export interface AdminPasswordResetResponse extends AdminApiMessage {
  newPassword: string;
}