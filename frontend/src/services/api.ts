import { auth } from '../firebase/config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to get the current Firebase ID token.
 */
const getAuthToken = async (): Promise<string | null> => {
  if (!auth?.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken(true);
  } catch (error) {
    console.error('Failed to get Firebase token', error);
    return null;
  }
};

/**
 * Base fetch wrapper that automatically attaches the Authorization header
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `API request failed: ${response.status}`);
  }

  return data;
}

// --- PLAYER APIs ---

export const getMyProfile = () => fetchWithAuth('/players/me');
export const createMyProfile = (username: string) => 
  fetchWithAuth('/players', {
    method: 'POST',
    body: JSON.stringify({ username })
  });
export const updateMyProfile = (updates: any) =>
  fetchWithAuth('/players/me', {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });

// --- WORLD APIs ---

export const getWorlds = () => fetchWithAuth('/worlds');
export const getWorldById = (id: string) => fetchWithAuth(`/worlds/${id}`);
export const createWorld = (worldData: any) =>
  fetchWithAuth('/worlds', {
    method: 'POST',
    body: JSON.stringify(worldData)
  });

// --- MEMORY & EVENT APIs ---

export const getWorldMemories = (worldId: string, type?: string) => {
  const query = type ? `?type=${type}` : '';
  return fetchWithAuth(`/worlds/${worldId}/memories${query}`);
};

export const getWorldEvents = (worldId: string) => fetchWithAuth(`/worlds/${worldId}/events`);

// --- CREATION APIs ---

export const getCreations = (worldId?: string) => {
  const query = worldId ? `?worldId=${worldId}` : '';
  return fetchWithAuth(`/creations${query}`);
};

// --- EVENT APIs ---
export const startEvent = (worldId: string, eventId: string) =>
  fetchWithAuth(`/worlds/${worldId}/events/${eventId}/start`, { method: 'POST' });

export const completeEvent = (worldId: string, eventId: string) =>
  fetchWithAuth(`/worlds/${worldId}/events/${eventId}/complete`, { method: 'POST' });

export const failEvent = (worldId: string, eventId: string) =>
  fetchWithAuth(`/worlds/${worldId}/events/${eventId}/fail`, { method: 'POST' });

export const getMyEvents = () => fetchWithAuth('/players/me/events');
export const getMyAchievements = () => fetchWithAuth('/players/me/achievements');

// --- INVENTORY APIs ---
export const getMyInventory = () => fetchWithAuth('/players/me/inventory');
export const collectItem = (itemId: string, quantity = 1) => 
  fetchWithAuth('/players/me/inventory/collect', { method: 'POST', body: JSON.stringify({ itemId, quantity }) });
export const useItem = (itemId: string) => 
  fetchWithAuth('/players/me/inventory/use', { method: 'POST', body: JSON.stringify({ itemId }) });
export const dropItem = (itemId: string, quantity = 1) => 
  fetchWithAuth('/players/me/inventory/drop', { method: 'POST', body: JSON.stringify({ itemId, quantity }) });
export const craftItem = (recipeId: string) => 
  fetchWithAuth('/players/me/crafting/craft', { method: 'POST', body: JSON.stringify({ recipeId }) });

// --- PROGRESSION APIs ---
export const getMyProgression = () => fetchWithAuth('/players/me/progression');
export const awardXP = (amount: number, source: string, sourceId?: string) => 
  fetchWithAuth('/players/me/progression/xp', { method: 'POST', body: JSON.stringify({ amount, source, sourceId }) });
export const unlockAbility = (abilityId: string, cost: number, levelRequirement: number) => 
  fetchWithAuth('/players/me/progression/unlock-ability', { method: 'POST', body: JSON.stringify({ abilityId, cost, levelRequirement }) });

// --- ACTION APIs ---
export const createWorldAction = (worldId: string, actionData: any) =>
  fetchWithAuth(`/worlds/${worldId}/actions`, {
    method: 'POST',
    body: JSON.stringify(actionData)
  });

// --- HEALTH API ---
export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch {
    return { status: 'error', database: 'disconnected' };
  }
};
