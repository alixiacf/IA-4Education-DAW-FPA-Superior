import React, { useState, useEffect } from 'react';
import { Timer, Trash2, Play, Pause } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, horasReales: number) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(task.horasReales * 3600); // Convert hours to seconds

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  useEffect(() => {
    setElapsedTime(task.horasReales * 3600);
  }, [task.horasReales]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (isRunning && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsRunning(false);
    } else {
      const startTime = Date.now() - (elapsedTime * 1000);
      const id = window.setInterval(() => {
        const newElapsedTime = (Date.now() - startTime) / 1000;
        setElapsedTime(newElapsedTime);
        onUpdate(task._id, newElapsedTime / 3600); // Convert seconds to hours for API
      }, 1000); // Update every second
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  const progress = (task.horasReales / task.horasEstimadas) * 100;
  const isOvertime = progress > 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{task.nombre}</h3>
        <button
          onClick={() => onDelete(task._id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Estimado: {task.horasEstimadas}h</span>
          <span>Real: {task.horasReales.toFixed(1)}h</span>
        </div>

        <div className="text-center font-mono text-xl font-bold text-gray-700 bg-gray-100 py-2 rounded">
          {formatTime(elapsedTime)}
        </div>

        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${Math.min(progress, 100)}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                isOvertime ? 'bg-red-500' : 'bg-green-500'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {isOvertime
              ? `Excedido: ${progress.toFixed(0)}%`
              : `Completado: ${progress.toFixed(0)}%`}
          </span>
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isRunning
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={16} /> Detener
              </>
            ) : (
              <>
                <Play size={16} /> Iniciar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};