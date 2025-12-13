# 🚌 Bus Express - React + Pasarela Gateway

Sistema de reserva de autobuses en tiempo real construido con **React** y [Pasarela Gateway](https://github.com/NeftaliYagua/Pasarela).

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Pasarela](https://img.shields.io/badge/Pasarela-Gateway-blueviolet)

## 🚀 Inicio Rápido

### Prerrequisitos

Pasarela Gateway ejecutándose en `http://localhost:5000`:

```bash
npx pasarela-gateway
# o con Docker
docker compose up -d
```

### Instalación

```bash
git clone https://github.com/Coderic/pasarela-ejemplo-bus.git
cd pasarela-ejemplo-bus
npm install
npm run dev
```

Abre http://localhost:5173

## 📖 Hook `usePasarela`

Este ejemplo incluye un hook React reutilizable:

```jsx
import { usePasarela } from './hooks/usePasarela';

function MiComponente() {
  const { 
    connected, 
    enviarATodos, 
    onMensaje 
  } = usePasarela('mi-usuario-id');

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
VITE_PASARELA_URL=http://localhost:5000
```

## 📁 Estructura

```
src/
├── hooks/
│   └── usePasarela.js    # Hook React para Pasarela
├── App.jsx               # Componente principal
├── App.css               # Estilos
└── main.jsx              # Entry point
```

## 🔗 Enlaces

- [Pasarela Gateway](https://github.com/NeftaliYagua/Pasarela)
- [Documentación](https://neftaliyagua.github.io/Pasarela/)
- [Otros ejemplos](https://github.com/Coderic?q=pasarela-ejemplo)

## 📄 Licencia

MIT © [Coderic](https://github.com/Coderic)
