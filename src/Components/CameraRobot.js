
import React, { useState } from "react";

export default function CameraRobot() {
  const [cameraUrl, setCameraUrl] = useState(
    "http://192.168.1.100"
  );
  const [showCamera, setShowCamera] = useState(false);

  return (
    <section className="camera-panel">
      <h2>Câmera do robô</h2>

      <label htmlFor="camera-url">
        Endereço IP da ESP32-CAM
      </label>

      <input
        id="camera-url"
        value={cameraUrl}
        onChange={(e) => setCameraUrl(e.target.value)}
        placeholder="http://192.168.1.100"
      />

      <button onClick={() => setShowCamera(true)}>
        Conectar câmera
      </button>

      {showCamera && (
        <div className="camera-view">
          <img
            src={`${cameraUrl.replace(/\/$/, "")}/`}
            alt="Imagem da câmera do robô"
            style={{
              width: "100%",
              maxWidth: "640px",
              aspectRatio: "4 / 3",
              objectFit: "contain",
              background: "#111",
            }}
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
            onLoad={(e) => {
              e.currentTarget.style.visibility = "visible";
            }}
          />
        </div>
      )}
    </section>
  );
}
