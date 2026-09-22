import { useEffect, useRef, useState, useCallback } from 'react';
import mqtt from 'mqtt';

/**
 * Hook que conecta diretamente ao broker HiveMQ Cloud via MQTT sobre
 * WebSocket seguro (wss://) e mantém o estado mais recente da bateria.
 *
 * A conexão é aberta quando o componente que usa o hook monta (ex: ao abrir
 * o dashboard) e fechada quando desmonta. Não depende de nenhum backend —
 * o próprio navegador vira um cliente MQTT.
 *
 * Variáveis de ambiente esperadas (arquivo .env do CRA, prefixo REACT_APP_):
 *   REACT_APP_HIVEMQ_HOST      ex: xxxxxxxx.s1.eu.hivemq.cloud
 *   REACT_APP_HIVEMQ_PORT      padrão 8884 (WebSocket/TLS)
 *   REACT_APP_HIVEMQ_USERNAME  credencial (idealmente só com permissão de subscribe)
 *   REACT_APP_HIVEMQ_PASSWORD
 *   REACT_APP_MQTT_TOPIC       padrão robot/battery/telemetry
 */
export function useBatteryTelemetry() {
  const [data, setData] = useState(null); // última leitura recebida
  const [status, setStatus] = useState('connecting'); // connecting | connected | error | disconnected
  const [error, setError] = useState(null);
  const clientRef = useRef(null);

  const topic = process.env.REACT_APP_MQTT_TOPIC || 'robot/battery/telemetry';

  useEffect(() => {
    const host = process.env.REACT_APP_HIVEMQ_HOST;
    const port = process.env.REACT_APP_HIVEMQ_PORT || '8884';
    const username = process.env.REACT_APP_HIVEMQ_USERNAME;
    const password = process.env.REACT_APP_HIVEMQ_PASSWORD;

    if (!host || !username || !password) {
      setStatus('error');
      setError(
        'Variáveis de ambiente REACT_APP_HIVEMQ_* não configuradas. Veja .env.example.'
      );
      return;
    }

    const url = `wss://${host}:${port}/mqtt`;

    const client = mqtt.connect(url, {
      username,
      password,
      clientId: `battery-dashboard-${Math.random().toString(16).slice(2, 10)}`,
      protocolVersion: 5,
      reconnectPeriod: 3000, // tenta reconectar a cada 3s se cair
      connectTimeout: 10_000,
      clean: true,
    });

    clientRef.current = client;

    client.on('connect', () => {
      setStatus('connected');
      setError(null);
      client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          setStatus('error');
          setError(`Falha ao inscrever no tópico: ${err.message}`);
        }
      });
    });

    client.on('reconnect', () => {
      setStatus('connecting');
    });

    client.on('close', () => {
      setStatus('disconnected');
    });

    client.on('error', (err) => {
      setStatus('error');
      setError(err.message);
    });

    client.on('message', (receivedTopic, payloadBuffer) => {
      const raw = payloadBuffer.toString();
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = { raw };
      }
      if (!parsed.timestamp) {
        parsed.timestamp = new Date().toISOString();
      }
      setData(parsed);
    });

    // Limpa a conexão quando o componente desmonta (ex: sai da página)
    return () => {
      client.end(true);
      clientRef.current = null;
    };
  }, [topic]);

  const disconnect = useCallback(() => {
    clientRef.current?.end(true);
  }, []);

  return { data, status, error, disconnect };
}
