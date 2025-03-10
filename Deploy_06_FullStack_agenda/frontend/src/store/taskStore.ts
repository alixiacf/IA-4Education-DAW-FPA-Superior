import { create } from 'zustand';
import { Task, CreateTaskDTO } from '../types/task';
import { tasksApi } from '../api/tasks';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskDTO) => Promise<void>;
  updateTaskTime: (id: string, horasReales: number) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await tasksApi.getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createTask: async (task: CreateTaskDTO) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await tasksApi.createTask(task);
      set(state => ({ tasks: [...state.tasks, newTask], isLoading: false }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateTaskTime: async (id: string, horasReales: number) => {
    try {
      const updatedTask = await tasksApi.updateTask(id, { horasReales });
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === id ? updatedTask : task
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteTask: async (id: string) => {
    try {
      await tasksApi.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task._id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));