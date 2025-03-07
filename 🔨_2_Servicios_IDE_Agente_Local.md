# 🔨 Servicios AI Fork IDE navegador Bolt.new
 Un fork (bifurcación) en informática es la creación de una copia de un proyecto de código fuente para desarrollar un nuevo proyecto independiente. Sus características principales son:

### Características Principales
* Es una copia de un proyecto original que permite desarrollar una versión diferente
* Permite trabajar en el código de manera independiente sin modificar el proyecto original
* Muy común en software de código abierto y desarrollo colaborativo

### Bolt.new
Se trata de una plataforma para la generación de código con IA, permite además la edición de código que puede ser editada manualmente. Bolt.new es un IDE (entorno de desarrollo integrado) basado en navegador , soporta frameworks como Astro, Next.js, Svelte y Vue.

En esta práctica vamos a instalar una aplicación un fork de Bolt.new llamado bolt.diy

#### Requiere instalar Node (previo)
Node.js es un entorno de ejecución de código abierto para el lenguaje JavaScript  sirve arquitecturas de rendimiento en tiempo real y pushed-back (ARQUITETURA DE COMUNICACIÓN CLIENTE SERVIDOR).

# INSTALACIÓN

Con CURL 
```
sudo apt install curl

curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh

sudo apt-get update

sudo bash nodesource_setup.sh

sudo apt install -y nodejs
```
 

Comprobamos  versión 
```

sudo node --version

npm -v
 
```
### INSTALAMOS BOLT.DIY
* Instalamos git para descargar el repositorio

```
sudo apt-get update
sudo apt-get install git 
```
* Clonamos el proyecto en una carpeta, en nuestro caso usaremos var /www  
```
cd /var/www
sudo mkdir bolt
cd bolt
sudo git clone https://github.com/stackblitz-labs/bolt.diy.git 
```
* Entramos en el directorio e instalamos los paquetes
 
```
cd bolt.diy
sudo npm init -y 
```
* Paquete pnpm
```
sudo npm install -g pnpm
```
Instalamos   
```
sudo pnpm install
```
Arrancamos la aplicación en modo developer
```
sudo pnpm run dev
```

Si hace falta
(DESHABILITAMOS LOS VHOST ser117.com y daw213.com ) dejamos en /etc/hosts 127.0.0.1 apunte a localhost.

## ÓPCIONAL uso de modelo local 
Los modelos locales consumen más recursos ya que se ejecutan en el equipo. Podemos configurar varios modelos. 
Arrancamos ollama, desde la terminal escribimos
```
sudo systemctl status ollama
```

Abrimos otra terminal y arrancamos bolt (DESDE EL DIRECTORIO bolt.diy /var/www/bolt/bolt.diy)

En la configuración del programa tenemos configurar el Rest-API del servicio ollama en el  http://0.0.0.0:11434
------------------------------------------------------------------------------------