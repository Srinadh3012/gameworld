import { useEffect, useRef } from 'react';

export interface Keys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  crouch: boolean;
  interact: boolean;
}

/**
 * Ref-based keyboard hook.
 * Returns a stable MutableRefObject so useFrame can read keys.current
 * without causing React re-renders on every key event.
 */
export function useKeyboard() {
  const keys = useRef<Keys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
    crouch: false,
    interact: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
        e.preventDefault();
      }
      switch (e.code) {
        case 'KeyW': keys.current.forward = true; break;
        case 'KeyS': keys.current.backward = true; break;
        case 'KeyA': keys.current.left = true; break;
        case 'KeyD': keys.current.right = true; break;
        case 'Space': keys.current.jump = true; break;
        case 'ShiftLeft':
        case 'ShiftRight': keys.current.sprint = true; break;
        case 'ControlLeft':
        case 'ControlRight': keys.current.crouch = true; break;
        case 'KeyE': keys.current.interact = true; break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': keys.current.forward = false; break;
        case 'KeyS': keys.current.backward = false; break;
        case 'KeyA': keys.current.left = false; break;
        case 'KeyD': keys.current.right = false; break;
        case 'Space': keys.current.jump = false; break;
        case 'ShiftLeft':
        case 'ShiftRight': keys.current.sprint = false; break;
        case 'ControlLeft':
        case 'ControlRight': keys.current.crouch = false; break;
        case 'KeyE': keys.current.interact = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
