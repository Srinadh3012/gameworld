import { useEffect, useRef, useState } from 'react';
import { useGameState } from '../context/GameStateContext';
import { GAME_ABILITIES } from '../data/abilityData';
import { guardianManager } from '../guardians/GuardianManager';

export function useAbilityInputs() {
  const { progression, showNotification } = useGameState();
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  
  // Ref to track last execution time to manage cooldowns accurately
  const lastUseRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const qAbility = 'ability_world_sense'; // Q
      const rAbility = 'ability_echo_vision'; // R
      const fAbility = 'ability_aether_step'; // F

      if (e.code === 'KeyQ') {
        tryUseAbility(qAbility);
      } else if (e.code === 'KeyR') {
        tryUseAbility(rAbility);
      } else if (e.code === 'KeyF') {
        tryUseAbility(fAbility);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [progression.unlockedAbilities, cooldowns]);

  const tryUseAbility = (abilityId: string) => {
    if (!progression.unlockedAbilities.includes(abilityId)) {
      showNotification('LOCKED', 'You have not unlocked this ability yet.');
      return;
    }

    const ability = GAME_ABILITIES[abilityId];
    if (!ability) return;

    const now = Date.now();
    const lastUse = lastUseRef.current[abilityId] || 0;
    const cooldownMs = (ability.cooldown || 0) * 1000;

    if (now - lastUse < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - (now - lastUse)) / 1000);
      showNotification('COOLDOWN', `${ability.name} is on cooldown for ${remaining}s.`);
      return;
    }

    // Execute ability logic based on ID
    executeAbility(abilityId);

    // Set Cooldown
    if (cooldownMs > 0) {
      lastUseRef.current[abilityId] = now;
      setCooldowns(prev => ({ ...prev, [abilityId]: now + cooldownMs }));
      
      // Clear cooldown state after it expires so UI can update
      setTimeout(() => {
        setCooldowns(prev => {
          const next = { ...prev };
          delete next[abilityId];
          return next;
        });
      }, cooldownMs);
    }
  };

  const executeAbility = (abilityId: string) => {
    const ability = GAME_ABILITIES[abilityId];
    showNotification('ABILITY USED', ability.name);

    // Dispatch a custom event so other 3D components can listen to it
    const event = new CustomEvent('gw_ability_used', { detail: { abilityId } });
    window.dispatchEvent(event);
    
    // Quick hook to advance guardian puzzles
    guardianManager.progressPhase();
  };

  return { cooldowns };
}
