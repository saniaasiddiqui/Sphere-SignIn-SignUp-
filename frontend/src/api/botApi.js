const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function joinMeeting({ platform, meetingUrl }) {
  const res = await fetch(`${API_BASE}/api/bot/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform, meeting_url: meetingUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to join meeting");
  return data;
}

export async function leaveMeeting({ platform, meetingUrl }) {
  const res = await fetch(`${API_BASE}/api/bot/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform, meeting_url: meetingUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to leave meeting");
  return data;
}

// ✅ NAYA — native ID se direct leave
export async function leaveMeetingNative({ platform, nativeMeetingId }) {
  const res = await fetch(
    `${API_BASE}/api/bot/leave-native/${platform}/${nativeMeetingId}`,
    { method: "POST" }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to leave meeting");
  return data;
}

export function detectPlatform(url) {
  if (/meet\.google\.com/i.test(url)) return "google_meet";
  if (/zoom\.us/i.test(url)) return "zoom";
  if (/teams\.microsoft\.com|teams\.live\.com/i.test(url)) return "teams";
  return "google_meet";
}