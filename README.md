# 🚌 Bus Express - React + Relay Gateway

Sistema de reserva de autobuses en tiempo real construido con **React** y [Relay Gateway](https://github.com/Coderic/Relay).

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Relay](https://img.shields.io/badge/Relay-Gateway-blueviolet)

## 🚀 Inicio Rápido

### Prerrequisitos

Relay Gateway ejecutándose en `http://localhost:5000`:

```bash
npx relay-gateway
# o con Docker
docker compose up -d
```

### Instalación

```bash
git clone https://github.com/Coderic/relay-ejemplo-bus.git
cd relay-ejemplo-bus
npm install
npm run dev
```

Abre http://localhost:5173

## 📖 Hook `useRelay`

Este ejemplo incluye un hook React reutilizable:

```jsx
import { useRelay } from './hooks/useRelay';

function MiComponente() {
  const { 
    connected, 
    enviarATodos, 
    onMensaje 
  } = useRelay('mi-usuario-id');

  useEffect(() => {
    const unsubscribe = onMensaje((data) => {
      console.log('Mensaje recibido:', data);
    });
    return unsubscribe;
  }, [onMensaje]);

  const enviar = () => {
    enviarATodos({ tipo: 'saludo', texto: 'Hola!' });
  };

  return (
    <div>
      Estado: {connected ? '🟢' : '🔴'}
      <button onClick={enviar}>Enviar</button>
    </div>
  );
}
```

## 🔧 Configuración

Crea un archivo `.env`:

```env
VITE_RELAY_URL=http://localhost:5000
```

## 📁 Estructura

```
src/
├── hooks/
│   └── useRelay.js    # Hook React para Relay
├── App.jsx               # Componente principal
├── App.css               # Estilos
└── main.jsx              # Entry point
```

## 🔗 Enlaces

- [Relay Gateway](https://github.com/Coderic/Relay)
- [Documentación](https://coderic.github.io/Relay/)
- [Otros ejemplos](https://github.com/Coderic?q=relay-ejemplo)

## 📄 Licencia

MIT © [Coderic](https://github.com/Coderic)
