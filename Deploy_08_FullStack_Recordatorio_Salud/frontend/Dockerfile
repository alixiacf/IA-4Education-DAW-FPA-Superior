FROM node:20-alpine

WORKDIR /app

# Solo copiamos los archivos de package para instalar las dependencias
COPY package*.json ./

# Instalamos todas las dependencias
RUN npm install

# Copiamos el código de la aplicación
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Iniciar en modo desarrollo con host configurado para permitir conexiones externas
CMD ["npm", "run", "dev", "--", "--host"]