# 🔨 Instalación Ollama Debian sin proxy
Ollama es una herramienta de inteligencia artificial (IA) que permite a los usuarios ejecutar modelos de lenguaje en sus propios ordenadores de manera local, sin necesidad de conectarse a Internet. Esto significa que los datos utilizados permanecen en el dispositivo del usuario, ofreciendo privacidad y control total sobre la información procesada.

### PROCESO DE INSTALACIÓN

Eliminamos las variables
```
unset HTTP_PROXY http_proxy HTTPS_PROXY https_proxy FTP_PROXY ftp_proxy
```

* Instalamos curl 

```
sudo apt-get install curl
```
* Descargamos e instalamos el paquete, tardará un poco
```
curl -fsSL https://ollama.com/install.sh | sh
```
* Descargamos un modelo 
 
ollama pull phi4

* Arrancamos 
```
ollama run phi4
```