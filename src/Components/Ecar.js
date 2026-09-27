import React, { useState, useEffect, useRef, useCallback } from 'react';
import mqtt from 'mqtt';
import './RobotMonitor.css';

const TOTAL_SEGMENTS = 12;
const JOYSTICK_THROTTLE_MS = 150;

/**
 * MQTT configuration.
 * - brokerUrl must be a WebSocket endpoint (ws:// or wss://), not the raw
 *   MQTT TCP port (1883). Mosquitto, for example, needs a `listener 9001`
 *   + `protocol websockets` block in its config to expose this.
 * - `topics` are what the ESP32 PUBLISHES to (dashboard subscribes).
 * - `commands` are what the ESP32 SUBSCRIBES to (dashboard publishes).
 * Adjust these strings to match your firmware.
 */
const MQTT_CONFIG = {
  brokerUrl: 'ws://192.168.1.100:9001',
  options: {
    clientId: `dashboard_${Math.random().toString(16).slice(2, 10)}`,
    // username: 'user',
    // password: 'pass',
    reconnectPeriod: 2000,
  },
  topics: {
    battery: 'robot/battery',         // payload: {"voltage":12.1,"percent":76}
    temperature: 'robot/temperature', // payload: {"temperature":34.2}
    direction: 'robot/direction',     // payload: {"direction":"forward"}
    motor: 'robot/motor',             // payload: {"motor":"on"}
    pwm: 'robot/pwm',                 // payload: {"pwm_value":50}
  },
  commands: {
    motorOn: 'robot/cmd/motor_on',
    motorOff: 'robot/cmd/motor_off',
    forward: 'robot/cmd/forward',
    reverse: 'robot/cmd/reverse',
    left: 'robot/cmd/motor_e',
    right: 'robot/cmd/motor_d',
    pwmOn: 'robot/cmd/pwm_on',
    pwmOff: 'robot/cmd/pwm_off',
    pwm25: 'robot/cmd/pwm_25',
    pwm50: 'robot/cmd/pwm_50',
    pwm75: 'robot/cmd/pwm_75',
    slider: 'robot/cmd/slider',       // payload: "50"
    drive: 'robot/cmd/drive',         // payload: {"angle":90,"force":0.8}
    requestTemperature: 'robot/cmd/temperature', // LER button
  },
};

/** Circular gauge, replaces the old Google Charts gauge */
function CircularGauge({ value, min = 0, max = 100, label, unit = '', size = 160 }) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, min), max);
  const pct = (clamped - min) / (max - min);
  const offset = circumference * (1 - pct);

  const color = pct < 0.2 ? '#ff3b3b' : pct < 0.5 ? '#ffaa00' : '#00eaff';

  return (
    <div className="gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="gauge-track"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div className="gauge-readout">
        <span className="gauge-value">{value != null ? value.toFixed ? value.toFixed(1) : value : '--'}{unit}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

/** Segmented battery bar, replaces the manually-built <div class="segment"> nodes */
function BatteryBar({ percent }) {
  const activeCount = Math.floor((percent / 100) * TOTAL_SEGMENTS);
  return (
    <div className="battery-bar">
      {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
        <div
          key={i}
          className={`segment${i < activeCount ? ' active' : ''}`}
          style={{ animationDelay: i < activeCount ? `${i * 0.1}s` : '0s' }}
        />
      ))}
    </div>
  );
}

/** Custom joystick (replaces nipplejs). Reports angle (deg) and force (0-1) while dragging. */
function Joystick({ onMove, onEnd, size = 140 }) {
  const zoneRef = useRef(null);
  const knobRef = useRef(null);
  const draggingRef = useRef(false);
  const lastSentRef = useRef(0);

  const handlePointerMove = useCallback((clientX, clientY) => {
    const zone = zoneRef.current;
    if (!zone) return;
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;

    const maxR = rect.width / 2;
    const dist = Math.min(Math.hypot(dx, dy), maxR);
    const angleRad = Math.atan2(-dy, dx); // invert y so "up" is positive
    const angleDeg = (angleRad * 180) / Math.PI;
    const force = +(dist / maxR).toFixed(2);

    const knobX = Math.cos(angleRad) * dist;
    const knobY = -Math.sin(angleRad) * dist;
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${knobX}px, ${knobY}px)`;
    }

    const now = Date.now();
    if (now - lastSentRef.current > JOYSTICK_THROTTLE_MS) {
      onMove({ angle: (angleDeg + 360) % 360, force });
      lastSentRef.current = now;
    }
  }, [onMove]);

  const resetKnob = () => {
    if (knobRef.current) knobRef.current.style.transform = 'translate(0px, 0px)';
  };

  const stopDragging = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    resetKnob();
    onEnd();
  }, [onEnd]);

  useEffect(() => {
    const onMouseMove = (e) => draggingRef.current && handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (!draggingRef.current) return;
      const t = e.touches[0];
      if (t) handlePointerMove(t.clientX, t.clientY);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', stopDragging);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [handlePointerMove, stopDragging]);

  return (
    <div
      ref={zoneRef}
      className="joystick-zone"
      style={{ width: size, height: size }}
      onMouseDown={(e) => { draggingRef.current = true; handlePointerMove(e.clientX, e.clientY); }}
      onTouchStart={(e) => {
        draggingRef.current = true;
        const t = e.touches[0];
        if (t) handlePointerMove(t.clientX, t.clientY);
      }}
    >
      <div ref={knobRef} className="joystick-knob" />
    </div>
  );
}

export default function Ecar() {
  const [voltage, setVoltage] = useState(null);
  const [percent, setPercent] = useState(0);
  const [temperature, setTemperature] = useState(null);
  const [direction, setDirection] = useState('--');
  const [motorStatus, setMotorStatus] = useState('--');
  const [pwmValue, setPwmValue] = useState('--');
  const [sliderValue, setSliderValue] = useState(50);
  const [leftRightToggle, setLeftRightToggle] = useState('NO');
  const [connected, setConnected] = useState(false);

  const hoverSoundRef = useRef(null);
  const clickSoundRef = useRef(null);
  const clientRef = useRef(null);

  /** Publish helper: no-ops silently if the broker isn't connected yet */
  const publish = useCallback((topic, payload = '') => {
    const client = clientRef.current;
    if (!client || !client.connected) {
      console.warn(`MQTT not connected, dropped publish to ${topic}`);
      return;
    }
    client.publish(topic, typeof payload === 'string' ? payload : JSON.stringify(payload));
  }, []);

  // Connect once on mount, subscribe to telemetry topics, route incoming
  // messages by topic into state, and clean up on unmount.
  useEffect(() => {
    const client = mqtt.connect(MQTT_CONFIG.brokerUrl, MQTT_CONFIG.options);
    clientRef.current = client;

    client.on('connect', () => {
      setConnected(true);
      Object.values(MQTT_CONFIG.topics).forEach((topic) => client.subscribe(topic));
    });
    client.on('reconnect', () => setConnected(false));
    client.on('close', () => setConnected(false));
    client.on('error', (err) => console.error('MQTT error:', err));

    client.on('message', (topic, messageBuf) => {
      const raw = messageBuf.toString();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = raw; // some firmwares may send plain values instead of JSON
      }

      switch (topic) {
        case MQTT_CONFIG.topics.battery:
          if (data?.voltage != null) setVoltage(data.voltage);
          if (data?.percent != null) setPercent(data.percent);
          break;
        case MQTT_CONFIG.topics.temperature:
          if (data?.temperature != null) setTemperature(data.temperature);
          break;
        case MQTT_CONFIG.topics.direction:
          if (data?.direction != null) setDirection(data.direction);
          break;
        case MQTT_CONFIG.topics.motor:
          if (data?.motor != null) setMotorStatus(data.motor);
          break;
        case MQTT_CONFIG.topics.pwm:
          if (data?.pwm_value != null) setPwmValue(data.pwm_value);
          break;
        default:
          break;
      }
    });

    return () => {
      client.end(true);
      clientRef.current = null;
    };
  }, []);

  const playHover = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    }
  };
  const playClick = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  // LER button: some setups push temperature on a timer already, but this
  // lets the dashboard explicitly ask the ESP32 to publish a fresh reading.
  const refreshTemperature = () => publish(MQTT_CONFIG.commands.requestTemperature);

  const motorOn = () => publish(MQTT_CONFIG.commands.motorOn);
  const motorOff = () => publish(MQTT_CONFIG.commands.motorOff);
  const forward = () => publish(MQTT_CONFIG.commands.forward);
  const reverse = () => publish(MQTT_CONFIG.commands.reverse);
  const motorLeftRight = () => {
    const topic = leftRightToggle === 'NO' ? MQTT_CONFIG.commands.left : MQTT_CONFIG.commands.right;
    setLeftRightToggle((t) => (t === 'NO' ? 'YES' : 'NO'));
    publish(topic);
  };
  const pwmOn = () => publish(MQTT_CONFIG.commands.pwmOn);
  const pwmOff = () => publish(MQTT_CONFIG.commands.pwmOff);
  const pwm25 = () => publish(MQTT_CONFIG.commands.pwm25);
  const pwm50 = () => publish(MQTT_CONFIG.commands.pwm50);
  const pwm75 = () => publish(MQTT_CONFIG.commands.pwm75);
  const updateValue = (val) => {
    setSliderValue(val);
    publish(MQTT_CONFIG.commands.slider, String(val));
  };

  const handleJoystickMove = ({ angle, force }) => {
    publish(MQTT_CONFIG.commands.drive, { angle, force });
  };
  const handleJoystickEnd = () => {
    publish(MQTT_CONFIG.commands.drive, { angle: 0, force: 0 });
  };

  const batteryColor = percent < 20 ? '#ff3b3b' : '#00eaff';

  return (
    <div className="container">
      <audio ref={hoverSoundRef} src="hover.mp3" />
      <audio ref={clickSoundRef} src="click.mp3" />

      <a href="/">Home</a>
      <div className="header-row">
        <h2>Data Robot</h2>
        <span className={`mqtt-status${connected ? ' online' : ''}`}>
          <span className="mqtt-dot" /> {connected ? 'MQTT connected' : 'MQTT offline'}
        </span>
      </div>

      <table>
        <thead>
          <tr>
            <th>eCarData</th>
            <th>Situation</th>
            <th>Position</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><h2>Battery</h2></td>
            <td><h2 style={{ color: batteryColor }}>{voltage != null ? `${voltage.toFixed(2)} V` : '--'}</h2></td>
            <td><h2>{percent}%</h2></td>
            <td><h2>--</h2></td>
          </tr>
          <tr>
            <td><p>Direction</p></td>
            <td><h2 id="direction">{direction}</h2></td>
            <td><h2>--</h2></td>
            <td><h2 id="pwm">{pwmValue}</h2></td>
          </tr>
          <tr>
            <td>CPU</td>
            <td><h2 id="temperature">{temperature != null ? `${temperature}°C` : '--'}</h2></td>
            <td><h2>--</h2></td>
            <td><h2 id="pwm">{pwmValue}</h2></td>
          </tr>
          <tr>
            <td>
              <button type="button" onClick={refreshTemperature}>LER</button>
            </td>
            <td colSpan={3}>
              <div className="joystick-wrap">
                <span className="joystick-label">Joystick Robot Car</span>
                <Joystick onMove={handleJoystickMove} onEnd={handleJoystickEnd} />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <button className="btn" onMouseEnter={playHover} onClick={playClick}>MANUAL</button>
              <button className="btn" onMouseEnter={playHover} onClick={playClick}>OVERRIDE</button>
            </td>
            <td>
              <button className="btn alt" onMouseEnter={playHover} onClick={playClick}>SCAN</button>
            </td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <td><button type="button" onClick={motorOn}>ON</button></td>
            <td><button type="button" onClick={motorOff}>OFF</button></td>
          </tr>
          <tr>
            <td><button type="button" onClick={motorLeftRight}>Left</button></td>
            <td><button type="button" onClick={forward}>F</button></td>
            <td><button type="button" onClick={motorLeftRight}>Right</button></td>
          </tr>
          <tr>
            <td><button type="button" onClick={reverse}>R</button></td>
          </tr>
          <tr>
            <td>
              <input
                type="range"
                min="1"
                max="100"
                value={sliderValue}
                className="slider"
                onChange={(e) => updateValue(e.target.value)}
              />
            </td>
            <td><label>Value: {sliderValue}</label></td>
          </tr>
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <th colSpan={7}>PWM</th>
            <td><button type="button" onClick={pwmOff}>PWM_OFF</button></td>
            <td><button type="button" onClick={pwmOn}>PWM_ON</button></td>
          </tr>
          <tr>
            <td><button type="button" onClick={pwm25}>PWM_25%</button></td>
            <td><button type="button" onClick={pwm50}>PWM_50%</button></td>
            <td><button type="button" onClick={pwm75}>PWM_75%</button></td>
          </tr>
        </tbody>
      </table>

      <div className="dials-row">
        <div className="circle">
          <span>{voltage != null ? `${voltage.toFixed(1)}V` : 'V'}</span>
        </div>

        <BatteryBar percent={percent} />

        <CircularGauge value={voltage ?? 0} min={0} max={15} label="Voltage" unit="V" />
        <CircularGauge value={percent ?? 0} min={0} max={100} label="Battery" unit="%" />

        <div className="circle">
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
}
