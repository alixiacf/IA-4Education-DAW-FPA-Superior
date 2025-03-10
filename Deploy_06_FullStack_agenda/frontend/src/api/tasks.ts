import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';
import { mockApi } from './mockData';

const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK = false; // Toggle this when real backend is ready

export const tasksApi = {
  getAllTasks: async (): Promise<Task[]> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockApi.getTasks());
        }, 500); // Simulate network delay
      });
    }

    const response = await fetch(`${API_URL}/tareas`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  createTask: async (task: CreateTaskDTO): Promise<Task> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockApi.addTask(task));
        }, 500);
      });
    }

    const response = await fetch(`${API_URL}/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  updateTask: async (id: string, data: UpdateTaskDTO): Promise<Task> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockApi.updateTask(id, data));
        }, 500);
      });
    }

    const response = await fetch(`${API_URL}/tareas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          mockApi.deleteTask(id);
          resolve();
        }, 500);
      });
    }

    const response = await fetch(`${API_URL}/tareas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },
};