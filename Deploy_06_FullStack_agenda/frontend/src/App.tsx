import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { TaskList } from './components/TaskList';
import { NewTaskModal } from './components/NewTaskModal';
import { useTaskStore } from './store/taskStore';

function App() {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const { tasks, isLoading, error, fetchTasks, createTask, updateTaskTime, deleteTask } = useTaskStore();

  useEffect(() => {
    fetchTasks().catch((err) => {
      toast.error('Error al cargar las tareas');
    });
  }, [fetchTasks]);

  const handleCreateTask = async (taskData: { nombre: string; horasEstimadas: number }) => {
    try {
      await createTask(taskData);
      toast.success('Tarea creada exitosamente');
    } catch (error) {
      toast.error('Error al crear la tarea');
    }
  };

  const handleUpdateTask = async (id: string, horasReales: number) => {
    try {
      await updateTaskTime(id, horasReales);
    } catch (error) {
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success('Tarea eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la tarea');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Tareas</h1>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Nueva Tarea
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay tareas. ¡Crea una nueva!
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>

      {showNewTaskModal && (
        <NewTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
}

export default App;