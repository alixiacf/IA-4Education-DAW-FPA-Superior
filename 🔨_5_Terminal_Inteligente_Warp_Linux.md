# 🔨  Terminal Inteligente Warp
Warp es un agente inteligente integrado en la terminal (Linux y recientemente Windows).

1. Descargamos el deb

https://www.warp.dev/download

2. Damos permisos al archivo
```
sudo chmod 644 /home/usuario/Descargas/[version].deb
```
```

sudo chmod +x warp-*.deb
```
```
cd /home/usuario/Descargas
```
```
sudo dpkg -i warp-*.deb
```

3. Instalamos
```
sudo apt-get install -f
```
4. Arrancamos
```
warp-terminal
```

Opción B
```
sudo apt-get install wget gpg wget -qO-https://releases.warp.dev/linux/keys/warp.asc | gpg --dearmor > warpdotdev.gpg
```
```

sudo install -D -o root -g root -m 644 warpdotdev.gpg /etc/apt/keyrings/warpdotdev.gpg
```
```
sudo sh -c 'echo "deb [arch=amd64
signed-by=/etc/apt/keyrings/warpdotdev.gpg] https://releases.warp.dev/linux/deb stable main" > /etc/apt/sources.list.d/warpdotdev.list' rm warpdotdev.gpg sudo apt update && sudo apt install warp-terminal
```
