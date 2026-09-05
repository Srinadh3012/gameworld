export const MAX_STAMINA = 100;
export const STAMINA_DRAIN_RATE = 25; // per second
export const STAMINA_REGEN_RATE = 15; // per second
export const MIN_STAMINA_TO_SPRINT = 20;

export function updateStamina(current: number, isSprinting: boolean, delta: number): number {
  if (isSprinting) {
    return Math.max(0, current - STAMINA_DRAIN_RATE * delta);
  } else {
    return Math.min(MAX_STAMINA, current + STAMINA_REGEN_RATE * delta);
  }
}
