import { Client } from '@stomp/stompjs';

let stompClient = null;
let handlers = { onConnected: null, onError: null };

// roomId -> { callback, sub }
const rooms = new Map();
// Connect hone se pehle aaye hue messages
const pendingSends = [];

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const WS_URL =
  import.meta.env.VITE_WS_URL ||
  (import.meta.env.PROD
    ? 'wss://nexus-arena-g0dp.onrender.com/ws-native'
    : 'ws://localhost:8080/ws-native');

const attachRoom = (roomId, entry) => {
  if (!stompClient || !stompClient.connected) return;

  if (entry.sub) {
    try {
      entry.sub.unsubscribe();
    } catch (e) {
      // purana connection band ho chuka ho to ignore
    }
  }

  entry.sub = stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
    const payload = JSON.parse(message.body);
    entry.callback(payload);
  });
  console.log('[WS] Subscribed to room:', roomId);
};

const publishNow = (roomId, action, payload) => {
  stompClient.publish({
    destination: `/app/game/${roomId}/${action}`,
    body: JSON.stringify(payload),
  });
};

export const connectWebSocket = (onConnected, onError) => {
  handlers = { onConnected, onError };

  if (stompClient) {
    if (stompClient.connected) {
      console.log('[WS] Already connected');
      if (onConnected) onConnected();
    } else {
      console.log('[WS] Client connecting, will notify when connected');
    }
    return;
  }

  console.log('[WS] Connecting to:', WS_URL);

  stompClient = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: (str) => console.log('[STOMP]', str),
    onConnect: (frame) => {
      console.log('[WS] Connected:', frame.headers);

      // 1. Reconnect ke baad saari rooms dobara subscribe karo
      rooms.forEach((entry, roomId) => attachRoom(roomId, entry));

      // 2. Queue me ruke hue messages bhejo
      while (pendingSends.length > 0) {
        const { roomId, action, payload } = pendingSends.shift();
        publishNow(roomId, action, payload);
      }

      // 3. Component ko batao
      if (handlers.onConnected) handlers.onConnected();
    },
    onStompError: (frame) => {
      console.error('[WS] Broker error:', frame.headers['message'], frame.body);
      if (handlers.onError) handlers.onError(frame);
    },
    onWebSocketError: (event) => {
      console.error('[WS] WebSocket error. URL:', WS_URL, event);
      if (handlers.onError) handlers.onError(event);
    },
    onWebSocketClose: (event) => {
      console.warn('[WS] Closed. code:', event.code, 'reason:', event.reason);
    },
  });

  stompClient.activate();
};

export const subscribeToRoom = (roomId, callback) => {
  const existing = rooms.get(roomId);
  if (existing && existing.sub) {
    try {
      existing.sub.unsubscribe();
    } catch (e) {
      // ignore
    }
  }

  const entry = { callback, sub: null };
  rooms.set(roomId, entry);

  if (stompClient && stompClient.connected) {
    attachRoom(roomId, entry);
  } else {
    console.warn('[WS] Not connected yet. Subscription queued for room:', roomId);
  }

  // Purane code se compatible: subscription.unsubscribe() chalega
  return {
    unsubscribe: () => {
      const current = rooms.get(roomId);
      if (current === entry) {
        if (entry.sub) {
          try {
            entry.sub.unsubscribe();
          } catch (e) {
            // ignore
          }
        }
        rooms.delete(roomId);
      }
    },
  };
};

export const sendMessage = (roomId, action, payload) => {
  if (stompClient && stompClient.connected) {
    publishNow(roomId, action, payload);
  } else {
    console.warn('[WS] Not connected yet. Message queued:', action);
    pendingSends.push({ roomId, action, payload });
  }
};

// Component unmount pe ye bulao: sirf subscriptions hatata hai, socket zinda rehta hai
export const disconnectWebSocket = () => {
  console.log('[WS] Leaving rooms (socket stays open)');
  rooms.forEach((entry) => {
    if (entry.sub) {
      try {
        entry.sub.unsubscribe();
      } catch (e) {
        // ignore
      }
    }
  });
  rooms.clear();
  pendingSends.length = 0;
};

// Poora socket band karna ho (logout pe) tab ye bulao
export const closeWebSocket = () => {
  disconnectWebSocket();
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};