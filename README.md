# 🚌 Bus Express - Reserva de Autobuses en Tiempo Real

Sistema de reserva de autobuses con disponibilidad en tiempo real construido con **React** y **[Relay Gateway](https://github.com/Coderic/Relay)**.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Relay](https://img.shields.io/badge/Relay-Gateway-blueviolet)

## 📖 Sobre este Ejemplo

**Bus Express** es un ejemplo funcional que demuestra cómo construir un sistema de reserva de autobuses con actualización de disponibilidad en tiempo real. Este ejemplo muestra:

- 🚌 **Selección de rutas** - Búsqueda de viajes por origen y destino
- 🎫 **Reserva de asientos** - Visualización y selección de asientos disponibles
- ⚡ **Actualización en tiempo real** - Los asientos se bloquean automáticamente cuando otros usuarios los seleccionan
- ⚠️ **Prevención de overbooking** - Múltiples usuarios no pueden reservar el mismo asiento
- 📊 **Gestión de reservas** - Vista de todas las reservas activas en tiempo real

Este ejemplo pertenece a la colección de ejemplos de **[Relay Gateway](https://github.com/Coderic/Relay)**, un gateway de comunicación en tiempo real diseñado para ser inmutable y agnóstico.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ o Docker
- Relay Gateway ejecutándose (ver [documentación de Relay](https://relay.coderic.net))

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Coderic/bus.git
cd bus

# Instalar dependencias
npm install
```

### Configuración

Asegúrate de tener Relay Gateway ejecutándose. Puedes usar el endpoint público para pruebas:

```javascript
// En tu código, el conector se conecta a:
const relay = new RelayConector('http://demo.relay.coderic.net');
```

O ejecuta Relay localmente:

```bash
# Opción 1: Con npx (recomendado para pruebas)
npx @coderic/relay

# Opción 2: Con Docker Compose
docker compose up -d
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173` (o el puerto que Vite asigne).

### Producción

```bash
# Construir para producción
npm run build

# Los archivos estarán en la carpeta dist/
```

## 🎯 Uso

1. **Abrir múltiples pestañas** para simular diferentes usuarios
2. **Seleccionar una ruta** de origen y destino
3. **Elegir asientos** - Observa cómo los asientos se bloquean en tiempo real cuando otros usuarios los seleccionan
4. **Realizar reservas** - Los asientos se reservan automáticamente
5. **Ver el dashboard** - Monitorea todas las reservas en tiempo real

## 🔗 Enlaces

- 📦 [Repositorio](https://github.com/Coderic/bus)
- 🐛 [Issues](https://github.com/Coderic/bus/issues)
- 🌐 [Demo en línea](https://coderic.org/bus/)
- 📚 [Documentación de Relay](https://relay.coderic.net)
- ⚡ [Relay Gateway](https://github.com/Coderic/Relay)

## 🛠️ Tecnologías

- **React** - Biblioteca JavaScript para construir interfaces de usuario
- **Vite** - Build tool y dev server
- **Relay Gateway** - Gateway de comunicación en tiempo real
- **Socket.io** - Comunicación WebSocket

## 📝 Licencia

MIT
