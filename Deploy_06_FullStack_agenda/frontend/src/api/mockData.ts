import { Task } from '../types/task';

export const mockTasks: Task[] = [
  {
    _id: '1',
    nombre: 'Diseño de interfaz',
    horasEstimadas: 8,
    horasReales: 4.5,
  },
  {
    _id: '2',
    nombre: 'Implementación de API',
    horasEstimadas: 12,
    horasReales: 6,
  },
  {
    _id: '3',
    nombre: 'Testing',
    horasEstimadas: 6,
    horasReales: 2,
  },
];

let tasks = [...mockTasks];

export const mockApi = {
  getTasks: () => [...tasks],
  addTask: (task: Omit<Task, '_id'>) => {
    const newTask = {
      ...task,
      _id: Math.random().toString(36).substr(2, 9),
      horasReales: 0,
    };
    tasks.push(newTask);
    return newTask;
  },
  updateTask: (id: string, updates: Partial<Task>) => {
    const taskIndex = tasks.findIndex(t => t._id === id);
    if (taskIndex === -1) throw new Error('Task not found');
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    return tasks[taskIndex];
  },
  deleteTask: (id: string) => {
    tasks = tasks.filter(t => t._id !== id);
  },
};