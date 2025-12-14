import { useState, useEffect, useMemo } from 'react';
import { useRelay } from './hooks/useRelay';
import './App.css';

const SESSION_ID = localStorage.getItem('busSession') || (() => {
  const id = 'user_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('busSession', id);
  return id;
})();

const RUTAS = [
  { id: 'mad-bcn', origen: 'Madrid', destino: 'Barcelona', hora: '08:00', precio: 45, asientos: 44 },
  { id: 'mad-val', origen: 'Madrid', destino: 'Valencia', hora: '09:30', precio: 35, asientos: 44 },
  { id: 'bcn-sev', origen: 'Barcelona', destino: 'Sevilla', hora: '10:00', precio: 55, asientos: 44 },
  { id: 'val-bil', origen: 'Valencia', destino: 'Bilbao', hora: '11:30', precio: 40, asientos: 44 },
];

function App() {
  const { connected, enviarATodos, onMensaje } = useRelay(SESSION_ID);
  
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [asientos, setAsientos] = useState({});
  const [seleccionados, setSeleccionados] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const inicial = {};
    RUTAS.forEach(ruta => {
      inicial[ruta.id] = Array(ruta.asientos).fill('disponible');
    });
    setAsientos(inicial);
  }, []);

  useEffect(() => {
    const unsubscribe = onMensaje((data) => {
      switch (data.tipo) {
        case 'asiento_reservado':
          setAsientos(prev => {
            const nuevo = { ...prev };
            if (nuevo[data.rutaId]) {
              nuevo[data.rutaId] = [...nuevo[data.rutaId]];
              nuevo[data.rutaId][data.asiento] = 'reservado';
            }
            return nuevo;
          });
          if (data.sessionId !== SESSION_ID) {
            addLog(`🔒 Asiento ${data.asiento + 1} reservado por otro usuario`);
          }
          break;

        case 'compra_confirmada':
          setAsientos(prev => {
            const nuevo = { ...prev };
            if (nuevo[data.rutaId]) {
              nuevo[data.rutaId] = [...nuevo[data.rutaId]];
              data.asientos.forEach(a => {
                nuevo[data.rutaId][a] = 'vendido';
              });
            }
            return nuevo;
          });
          addLog(`✅ Compra confirmada: ${data.asientos.length} asientos`);
          break;

        case 'sync_request':
          if (data.sessionId !== SESSION_ID) {
            enviarATodos({ tipo: 'sync_response', asientos, sessionId: SESSION_ID });
          }
          break;

        case 'sync_response':
          if (data.asientos) {
            setAsientos(prev => ({ ...prev, ...data.asientos }));
          }
          break;
      }
    });

    return unsubscribe;
  }, [onMensaje, asientos, enviarATodos]);

  useEffect(() => {
    if (connected) {
      enviarATodos({ tipo: 'sync_request', sessionId: SESSION_ID });
      addLog('🟢 Conectado a Relay');
    }
  }, [connected, enviarATodos]);

  const addLog = (msg) => {
    setLogs(prev => [{
      time: new Date().toLocaleTimeString('es'),
      msg
    }, ...prev].slice(0, 20));
  };

  const toggleAsiento = (idx) => {
    if (!rutaSeleccionada) return;
    const estado = asientos[rutaSeleccionada.id]?.[idx];
    if (estado !== 'disponible') return;

    setSeleccionados(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      }
      if (prev.length >= 4) {
        addLog('⚠️ Máximo 4 asientos por compra');
        return prev;
      }
      return [...prev, idx];
    });
  };

  const reservar = () => {
    if (!rutaSeleccionada || seleccionados.length === 0) return;

    seleccionados.forEach(idx => {
      enviarATodos({
        tipo: 'asiento_reservado',
        rutaId: rutaSeleccionada.id,
        asiento: idx,
        sessionId: SESSION_ID
      });
    });

    const asientosCompra = [...seleccionados];
    setTimeout(() => {
      enviarATodos({
        tipo: 'compra_confirmada',
        rutaId: rutaSeleccionada.id,
        asientos: asientosCompra,
        sessionId: SESSION_ID
      });
    }, 2000);

    addLog(`🎫 Reservando ${seleccionados.length} asientos...`);
    setSeleccionados([]);
  };

  const disponibles = useMemo(() => {
    if (!rutaSeleccionada || !asientos[rutaSeleccionada.id]) return 0;
    return asientos[rutaSeleccionada.id].filter(a => a === 'disponible').length;
  }, [rutaSeleccionada, asientos]);

  const total = seleccionados.length * (rutaSeleccionada?.precio || 0);

  // Generar filas de asientos (4 por fila: 2 + pasillo + 2)
  const getFilas = () => {
    if (!rutaSeleccionada) return [];
    const numAsientos = rutaSeleccionada.asientos;
    const filas = [];
    for (let i = 0; i < numAsientos; i += 4) {
      filas.push([i, i + 1, i + 2, i + 3].filter(n => n < numAsientos));
    }
    return filas;
  };

  return (
    <div className="app">
      <header>
        <h1>🚌 BusExpress</h1>
        <p>Reserva de autobuses en tiempo real</p>
        <div className={`status ${connected ? 'online' : ''}`}>
          <span className="dot"></span>
          {connected ? 'Conectado' : 'Desconectado'}
        </div>
      </header>

      <main>
        <section className="rutas">
          <h2>🗓️ Rutas Disponibles</h2>
          <div className="rutas-grid">
            {RUTAS.map(ruta => (
              <div
                key={ruta.id}
                className={`ruta-card ${rutaSeleccionada?.id === ruta.id ? 'selected' : ''}`}
                onClick={() => {
                  setRutaSeleccionada(ruta);
                  setSeleccionados([]);
                }}
              >
                <div className="ruta-header">
                  <span className="hora">{ruta.hora}</span>
                  <span className="precio">${ruta.precio}</span>
                </div>
                <div className="ruta-destino">
                  <span>{ruta.origen}</span>
                  <span className="arrow">→</span>
                  <span>{ruta.destino}</span>
                </div>
                <div className="ruta-disponibles">
                  {asientos[ruta.id]?.filter(a => a === 'disponible').length || 0} disponibles
                </div>
              </div>
            ))}
          </div>
        </section>

        {rutaSeleccionada && (
          <section className="selector">
            <h2>🪑 Selecciona tus asientos</h2>
            <div className="bus-info">
              <strong>{rutaSeleccionada.origen} → {rutaSeleccionada.destino}</strong>
              <span>{rutaSeleccionada.hora} | {disponibles} disponibles</span>
            </div>

            {/* Bus visual desde arriba */}
            <div className="bus-container">
              <div className="bus-shape">
                {/* Ruedas delanteras */}
                <div className="bus-wheels-front">
                  <div className="wheel"></div>
                  <div className="wheel"></div>
                </div>

                {/* Frente del bus */}
                <div className="bus-front">
                  <span className="driver-icon">🧑‍✈️</span>
                </div>

                {/* Asientos */}
                <div className="bus-seats">
                  {getFilas().map((fila, filaIdx) => (
                    <div key={filaIdx} className="seat-row">
                      {fila.slice(0, 2).map(idx => (
                        <div
                          key={idx}
                          className={`asiento ${asientos[rutaSeleccionada.id]?.[idx] || 'disponible'} ${seleccionados.includes(idx) ? 'seleccionado' : ''}`}
                          onClick={() => toggleAsiento(idx)}
                        >
                          {idx + 1}
                        </div>
                      ))}
                      <div className="pasillo"></div>
                      {fila.slice(2, 4).map(idx => (
                        <div
                          key={idx}
                          className={`asiento ${asientos[rutaSeleccionada.id]?.[idx] || 'disponible'} ${seleccionados.includes(idx) ? 'seleccionado' : ''}`}
                          onClick={() => toggleAsiento(idx)}
                        >
                          {idx + 1}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Ruedas traseras */}
                <div className="bus-wheels-back">
                  <div className="wheel"></div>
                  <div className="wheel"></div>
                </div>

                {/* Parte trasera */}
                <div className="bus-back">
                  <div className="light"></div>
                  <div className="light"></div>
                </div>
              </div>
            </div>

            <div className="leyenda">
              <span><span className="dot disponible"></span> Disponible</span>
              <span><span className="dot reservado"></span> Reservado</span>
              <span><span className="dot vendido"></span> Vendido</span>
              <span><span className="dot seleccionado"></span> Seleccionado</span>
            </div>

            <div className="resumen">
              <div>
                <span>Asientos: </span>
                <strong>{seleccionados.length > 0 ? seleccionados.map(i => i + 1).join(', ') : 'Ninguno'}</strong>
              </div>
              <div className="total">
                Total: <strong>${total}</strong>
              </div>
            </div>

            <button
              className="btn-reservar"
              onClick={reservar}
              disabled={seleccionados.length === 0}
            >
              {seleccionados.length > 0
                ? `Reservar ${seleccionados.length} asiento(s) - $${total}`
                : 'Selecciona asientos'}
            </button>
          </section>
        )}

        <section className="logs">
          <h3>📋 Actividad</h3>
          <div className="log-list">
            {logs.map((log, i) => (
              <div key={i} className="log-entry">
                <span className="time">{log.time}</span>
                <span>{log.msg}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
