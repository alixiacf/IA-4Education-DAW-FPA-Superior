FROM node:18
 

WORKDIR /home/app/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
