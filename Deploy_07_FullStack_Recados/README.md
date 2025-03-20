# Aplicación FullStack Recados

Un sistema de gestión de tareas y citas con notificaciones, construido con una arquitectura de microservicios.

## Descripción General

Esta aplicación permite a los usuarios:
- Registrar tareas y citas
- Recibir notificaciones de eventos próximos
- Gestionar su agenda personal de manera efectiva

## Arquitectura

La aplicación está construida con un enfoque de microservicios y consta de dos componentes principales:
- **Frontend**: Aplicación en React con TypeScript y Tailwind CSS
- **Backend**: Servidor API desarrollado con Node.js

## Despliegue

La aplicación está contenedorizada con Docker y se despliega utilizando Docker Compose, lo que facilita su configuración y ejecución en cualquier entorno.

### Requisitos Previos

- Tener instalados Docker y Docker Compose en el sistema

### Pasos para Desplegar

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd Deploy_07_FullStack_Recados
   ```

2. Ejecutar el siguiente comando:
   ```bash
   docker-compose up -d
   ```

Esto hará lo siguiente:
- Construir los contenedores de frontend y backend
- Configurar la red entre los servicios
- Iniciar todos los servicios en modo desacoplado

### Detener la Aplicación
Para detener la aplicación:
```bash
docker-compose down
```

Para detener y eliminar los volúmenes de datos (esto borrará toda la información almacenada):
```bash
docker-compose down -v
```

## Beneficios de la Arquitectura de Microservicios

La arquitectura de microservicios ofrece varias ventajas:
- **Escalabilidad**: Cada servicio puede escalarse de manera independiente
- **Mantenibilidad**: Los servicios pueden desarrollarse y desplegarse por separado
- **Resiliencia**: Un fallo en un servicio no afecta a toda la aplicación
- **Flexibilidad Tecnológica**: Se pueden utilizar diferentes tecnologías para distintos servicios

## Acceso a la Aplicación

Después del despliegue, la aplicación estará disponible en:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## Sistema de Notificaciones

La aplicación incluye un sistema de notificaciones que alerta a los usuarios sobre tareas y citas próximas, mejorando la organización y gestión del tiempo.

## Tecnologías Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB
- **Contenedorización**: Docker, Docker Compose
