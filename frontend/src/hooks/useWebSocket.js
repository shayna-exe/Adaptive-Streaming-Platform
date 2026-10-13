import { useEffect, useRef, useState, useCallback } from 'react';
import { WS_URL } from '../services/api';

export function useWebSocket() {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const retryCount = useRef(0);
  
  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(WS_URL);
      
      wsRef.current.onopen = () => {
        setConnected(true);
        retryCount.current = 0;
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setData(parsed);
          setConnected(true);
        } catch (e) {
          console.error("Failed to parse websocket message", e);
        }
      };
      
      wsRef.current.onclose = () => {
        setConnected(false);
        const timeout = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
        retryCount.current += 1;
        reconnectTimer.current = setTimeout(connect, timeout);
      };

      wsRef.current.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    } catch (e) {
      console.error("Error creating WebSocket", e);
    }
  }, []);
  
  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);
  
  return { data, connected };
}
