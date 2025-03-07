FROM node:18

WORKDIR /home/app

COPY package*.json ./

# Instalamos primero @rollup/wasm-node para asegurar que está disponible
RUN npm install @rollup/wasm-node --no-save

# Instalamos las dependencias del proyecto
RUN npm install

COPY . .

EXPOSE 5173
 

# Ejecutamos la aplicación exponiéndola en todas las interfaces
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]