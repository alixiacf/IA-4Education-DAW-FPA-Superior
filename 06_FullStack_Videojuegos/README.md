
# Proyecto de API con Express y Mongoose
# Contenedores docker

Este proyecto utiliza Express para crear una API RESTful y Mongoose para interactuar con una base de datos MongoDB.
# README

Esta guía explica cómo ejecutar una aplicación con **Docker Compose**.

## Requisitos Previos
- Docker instalado y en ejecución.
- Docker Compose instalado (en muchos sistemas viene incluido con Docker Desktop).

---

## 1. Clonar el Repositorio

1. Abre tu terminal y navega hasta la carpeta deseada.
2. Ejecuta. Sustituye el usuario y el proyecto por el del repositorio:
   ```bash
   git clone https://github.com/alixiacf/U3_1.git
   ``` 
   
Entra en la carpeta del proyecto. Sustituye mi-proyecto por el nombre que tiene el repositorio:
   ```bash
cd mi-proyecto
   ``` 
### 2. Revisar docker-compose.yml
El archivo docker-compose.yml describe la configuración de tu aplicación y sus servicios. Por ejemplo:
   ```bash
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db

  db:
    image: mongo
    ports:
      - "27017:27017"
   ```
En Linux verificar que tenemos instalado compose
   ```bash
sudo apt update
   ``` 
   ```bash
sudo apt upgrade
   ``` 
   ```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   ``` 
   ```bash
sudo chmod +x /usr/local/bin/docker-compose
   ``` 
   ```bash
sudo docker-compose --version
   ``` 

Crea el grupo de docker sino existe
   ```bash
sudo groupadd docker
   ``` 
   ```bash
sudo usermod -aG docker $USER
   ``` 
   ```bash
su -s ${USER}
   ```

   ```bash
docker run hello-world
   ``` 



## 3. Desplegar la Aplicación
Desde la carpeta del proyecto, ejecutamos compose para construir la imagen en segundo plano:

   ```bash
       sudo docker compose up -d --build
   ``` 

-d levanta los contenedores en segundo plano.

Comprueba que todo esté corriendo:
   ```bash
sudo docker-compose ps
   ``` 
(Opcional) Para ver los logs en tiempo real:
 ```bash
sudo docker-compose logs -f
   ``` 

## 4. Uso de la Aplicación
Accede a la aplicación en http://localhost:8080 (o el puerto configurado).
Revisa la documentación o código fuente para conocer las rutas disponibles.

PROBLEMAS EN LINUX POR 
Los containers se han caido por falta de permisos
sudo docker ps -a
El container base de datos lo podemos arrancar por su nombre 
  ```bash
sudo docker start u3_1-base_datos-1  
   ```
Inicializamos la Base de datos. Entramos en el contenedor y una vez que ya tenemos el nombre del usuario para la conexión podemos levantar el contenedor backend.
  ```bash
sudo docker start u3_1-backend-1
   ```
## 5. Configurar el usuario de acceso
sudo docker exec -it u3_1-base_datos-1 mongosh -u root -p supersecreta --authenticationDatabase admin
  ```bash
use admin
   ```
 ```bash
db.createUser({
  user: "daw",
  pwd: "abc123.",
  roles: ["userAdminAnyDatabase", "readWriteAnyDatabase"]
})
   ```
Nos devuelve {ok:1}

Volvemos a levantar con 
 ```bash
sudo docker compose up 
   ```

## 6. Parar y Limpiar
Eliminamos los dockers con , redes y volúmenes
 ```bash
                sudo docker compose down -v 
   ```
Eliminamos todos los recursos no utilizados 
 ```bash
               sudo docker system prune --volumes -a
   ``` 
Verificamos todo el sistema
 ```bash
              sudo docker system df
              sudo docker volume prune -a -f

    ``` 
Test con 
https://github.com/jchook/stable-diffusion-webui-docker
https://github.com/ricardobalk/streamlit-ollama

## Authors

- [@alixiacf](https://www.github.com/alixiacf)

