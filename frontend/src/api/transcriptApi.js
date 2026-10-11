const WS_BASE = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000";

export function connectTranscript(platform, nativeMeetingId, onMessage, onError) {
  const url = `${WS_BASE}/ws/transcript/${platform}/${nativeMeetingId}`;
  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("Transcript WebSocket connected");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("Failed to parse transcript message:", err);
    }
  };

  ws.onerror = (err) => {
    console.error("Transcript WebSocket error:", err);
    if (onError) onError(err);
  };

  ws.onclose = () => {
    console.log("Transcript WebSocket disconnected");
  };

  return ws;
}