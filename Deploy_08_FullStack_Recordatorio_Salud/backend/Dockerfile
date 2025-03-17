FROM node:20-alpine

WORKDIR /app

# Solo copiamos los archivos de package para instalar las dependencias
COPY package*.json ./

# Instalamos las dependencias directamente (sin etapas múltiples)
RUN npm install

# Copiamos el código de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]