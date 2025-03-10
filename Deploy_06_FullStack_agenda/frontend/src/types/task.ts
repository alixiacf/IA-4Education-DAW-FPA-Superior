export interface Task {
  _id: string;
  nombre: string;
  horasEstimadas: number;
  horasReales: number;
}

export interface CreateTaskDTO {
  nombre: string;
  horasEstimadas: number;
}

export interface UpdateTaskDTO {
  horasReales: number;
}