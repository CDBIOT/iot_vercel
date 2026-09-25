import React from 'react';
import { Battery } from './batteryTelemetry';
import '../../styles/BatteryDashboard.css';

const STATUS_LABEL = {
  connecting: 'Conectando ao HiveMQ...',
  connected: 'Conectado',
  disconnected: 'Desconectado',
  error: 'Erro de conexão',
};

function batteryLevelClass(percentage) {
  if (percentage == null) return '';
  if (percentage <= 20) return 'battery-level--low';
  if (percentage <= 50) return 'battery-level--medium';
  return 'battery-level--high';
}

export default function Dashboard() {
  const { data, status, error } = batteryTelemetry();

  return (
    <div className="battery-dashboard">
      <div className={`battery-dashboard__status battery-dashboard__status--${status}`}>
        <span className="battery-dashboard__status-dot" />
        {STATUS_LABEL[status] || status}
      </div>

      {error && <div className="battery-dashboard__error">{error}</div>}

      {!data && status === 'connecting' && (
        <p className="battery-dashboard__hint">Aguardando primeira leitura do ESP32...</p>
      )}

      {data && (
        <div className="battery-dashboard__grid">
          <div className="battery-card battery-card--main">
            <span className="battery-card__label">Carga</span>
            <div className={`battery-card__value ${batteryLevelClass(data.percentage)}`}>
              {data.percentage != null ? `${data.percentage}%` : '—'}
            </div>
            {data.charging && <span className="battery-card__badge">⚡ Carregando</span>}
          </div>

          <div className="battery-card">
            <span className="battery-card__label">Voltagem</span>
            <div className="battery-card__value">
              {data.voltage != null ? `${data.voltage} V` : '—'}
            </div>
          </div>

          <div className="battery-card">
            <span className="battery-card__label">Corrente</span>
            <div className="battery-card__value">
              {data.current != null ? `${data.current} A` : '—'}
            </div>
          </div>

          <div className="battery-card">
            <span className="battery-card__label">Temperatura</span>
            <div className="battery-card__value">
              {data.temperature != null ? `${data.temperature} °C` : '—'}
            </div>
          </div>

          <div className="battery-dashboard__timestamp">
            Última leitura: {new Date(data.timestamp).toLocaleString('pt-BR')}
          </div>
        </div>
      )}
    </div>
  );
}
