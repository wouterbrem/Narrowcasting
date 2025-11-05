import { useEffect, useRef, useState, useCallback } from 'react';
import { getWebSocketUrl } from '../services/api';

/**
 * WebSocket Hook
 * Manages WebSocket connection with automatic reconnection
 *
 * @param {Object} handlers - Event handlers
 * @param {Function} handlers.onMessage - Called when message received
 * @param {Function} [handlers.onConnect] - Called when connected
 * @param {Function} [handlers.onDisconnect] - Called when disconnected
 * @param {Function} [handlers.onError] - Called on error
 * @returns {Object} WebSocket state and controls
 */
export function useWebSocket(handlers = {}) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = handlers;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        if (onConnect) onConnect();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          if (onMessage) onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          if (onError) onError(error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        if (onDisconnect) onDisconnect();

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      if (onError) onError(error);
    }
  }, [onMessage, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const send = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    console.warn('WebSocket is not connected');
    return false;
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    send,
    reconnect: connect,
    disconnect
  };
}

/**
 * Use Narrowcast WebSocket
 * Specific hook for Narrowcast Pro WebSocket with typed event handlers
 *
 * @returns {Object} WebSocket state and data
 */
export function useNarrowcastWebSocket() {
  const [devices, setDevices] = useState([]);
  const [slides, setSlides] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [statistics, setStatistics] = useState(null);

  const handleMessage = useCallback((data) => {
    switch (data.type) {
      case 'initial-state':
        setDevices(data.devices || []);
        setSlides(data.slides || []);
        setPresentations(data.presentations || []);
        setStatistics(data.statistics || null);
        break;

      case 'deviceFound':
        setDevices(prev => [...prev, data.device]);
        break;

      case 'deviceLost':
        setDevices(prev => prev.filter(d => d.id !== data.deviceId));
        break;

      case 'deviceStatus':
        setDevices(prev => prev.map(d =>
          d.id === data.deviceId ? { ...d, status: data.status } : d
        ));
        break;

      case 'slideCreated':
        setSlides(prev => [...prev, data.slide]);
        break;

      case 'slideUpdated':
        setSlides(prev => prev.map(s =>
          s.id === data.slide.id ? data.slide : s
        ));
        break;

      case 'slideDeleted':
        setSlides(prev => prev.filter(s => s.id !== data.slideId));
        break;

      case 'presentationCreated':
        setPresentations(prev => [...prev, data.presentation]);
        break;

      case 'presentationUpdated':
        setPresentations(prev => prev.map(p =>
          p.id === data.presentation.id ? data.presentation : p
        ));
        break;

      case 'presentationDeleted':
        setPresentations(prev => prev.filter(p => p.id !== data.presentationId));
        break;

      case 'groupCreated':
      case 'groupDeleted':
        // Handle group updates if needed
        break;

      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }, []);

  const { isConnected, send, reconnect } = useWebSocket({
    onMessage: handleMessage,
    onConnect: () => console.log('Narrowcast WebSocket connected'),
    onDisconnect: () => console.log('Narrowcast WebSocket disconnected'),
    onError: (error) => console.error('Narrowcast WebSocket error:', error)
  });

  return {
    isConnected,
    devices,
    slides,
    presentations,
    statistics,
    send,
    reconnect
  };
}

export default useWebSocket;
