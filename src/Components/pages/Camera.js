   import React, { useState } from "react";
   
   export default function Camera() {
   
   {/* ESP32-CAM video panel. For an MJPEG stream, enter its stream URL,
          for example http://192.168.1.50/stream. */}
      <section
        aria-label="Camera do robô"
        style={{
          margin: '20px 0',
          padding: '16px',
          border: '1px solid #394150',
          borderRadius: '12px',
          background: '#111827',
          color: '#f9fafb',
        }}
      >
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <h3 style={{ margin: 0 }}>Câmera do robô</h3>
          <span
            role="status"
            style={{
              fontSize: '0.9rem',
              color: cameraEnabled && !cameraError ? '#4ade80' : '#fbbf24',
            }}
          >
            {cameraEnabled && !cameraError
              ? 'Conectando / transmissão ativa'
              : cameraError
                ? 'Não foi possível carregar o vídeo'
                : 'Câmera desconectada'}
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCameraError(false);
            setCameraEnabled(Boolean(cameraUrl.trim()));
          }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <label htmlFor="robot-camera-url" style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}>
            URL do fluxo de vídeo da ESP32-CAM
          </label>
          <input
            id="robot-camera-url"
            type="url"
            value={cameraUrl}
            onChange={(e) => {
              setCameraUrl(e.target.value);
              setCameraError(false);
            }}
            placeholder="http://192.168.1.50/stream"
            style={{
              flex: '1 1 280px',
              minWidth: 0,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #6b7280',
              background: '#fff',
              color: '#111827',
            }}
          />
          <button type="submit" disabled={!cameraUrl.trim()}>
            Conectar câmera
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraEnabled(false);
              setCameraError(false);
            }}
          >
            Desconectar
          </button>
        </form>

        <div style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          aspectRatio: '4 / 3',
          minHeight: '220px',
          maxHeight: '65vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: '8px',
          background: '#030712',
        }}>
          {cameraEnabled && !cameraError ? (
            <img
              key={cameraUrl}
              src={cameraUrl.trim()}
              alt="Transmissão ao vivo da ESP32-CAM"
              onError={() => setCameraError(true)}
              onLoad={() => setCameraError(false)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: '#9ca3af',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📷</div>
              <p style={{ margin: '0 0 8px' }}>
                {cameraError
                  ? 'Verifique o IP, o caminho do fluxo e se a câmera está na mesma rede.'
                  : 'Informe a URL do fluxo de vídeo da ESP32-CAM e clique em “Conectar câmera”.'}
              </p>
              <small>
                A URL deve apontar para um fluxo compatível com navegador, como MJPEG.
              </small>
            </div>
          )}
        </div>
        <p style={{ margin: '10px 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>
          Dica: o IP e o caminho dependem do servidor instalado na ESP32-CAM.
          Se a página React estiver em HTTPS, o navegador pode bloquear um fluxo HTTP.
        </p>
      </section>
   }