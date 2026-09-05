import { getMyProgression, awardXP, unlockAbility } from '../../services/api';
import { GAME_ABILITIES } from '../data/abilityData';

export interface LocalProgression {
  level: number;
  experience: number;
  totalExperience: number;
  skillPoints: number;
  explorationXP: number;
  discoveryXP: number;
  memoryXP: number;
  eventXP: number;
  craftingXP: number;
  worldImpactXP: number;
  unlockedAbilities: string[];
  claimedRewards: string[];
}

const DEFAULT_PROGRESSION: LocalProgression = {
  level: 1,
  experience: 0,
  totalExperience: 0,
  skillPoints: 0,
  explorationXP: 0,
  discoveryXP: 0,
  memoryXP: 0,
  eventXP: 0,
  craftingXP: 0,
  worldImpactXP: 0,
  unlockedAbilities: [],
  claimedRewards: [],
};

const STORAGE_KEY = 'gw_progression';

export const saveLocalProgression = (prog: LocalProgression) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
  } catch (e) {
    console.warn('Failed to save progression to local storage', e);
  }
};

export const loadLocalProgression = (): LocalProgression => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load progression from local storage', e);
  }
  return { ...DEFAULT_PROGRESSION };
};

class ProgressionSystem {
  private localFallback = false;

  async init(): Promise<LocalProgression> {
    try {
      const res = await getMyProgression();
      if (res && res.success && res.data) {
        this.localFallback = false;
        saveLocalProgression(res.data);
        return res.data;
      }
    } catch (e) {
      console.warn('Failed to fetch progression from backend, using local fallback', e);
      this.localFallback = true;
    }
    return loadLocalProgression();
  }

  async awardXP(
    amount: number, 
    source: string, 
    sourceId?: string,
    currentProgression: LocalProgression = loadLocalProgression()
  ): Promise<{ progression: LocalProgression; leveledUp: boolean } | null> {
    // 1. Backend flow
    try {
      const res = await awardXP(amount, source, sourceId);
      if (res && res.success && res.data) {
        this.localFallback = false;
        saveLocalProgression(res.data);
        return { progression: res.data, leveledUp: !!res.leveledUp };
      }
    } catch (e) {
      console.warn('Backend XP award failed, falling back to local', e);
      this.localFallback = true;
    }

    // 2. Local fallback flow
    if (this.localFallback) {
      if (sourceId) {
        const rewardKey = `${source}_${sourceId}`;
        if (currentProgression.claimedRewards.includes(rewardKey)) {
          return null; // duplicate
        }
        currentProgression.claimedRewards.push(rewardKey);
      }

      if (source === 'EXPLORATION' || source === 'REGION_DISCOVERY' || source === 'HIDDEN_LOCATION') currentProgression.explorationXP += amount;
      else if (source === 'DISCOVERY' || source === 'INSPECT') currentProgression.discoveryXP += amount;
      else if (source === 'MEMORY') currentProgression.memoryXP += amount;
      else if (source === 'EVENT') currentProgression.eventXP += amount;
      else if (source === 'CRAFTING') currentProgression.craftingXP += amount;
      else if (source === 'WORLD_IMPACT' || source === 'CORE_ACTIVATION' || source === 'WORLD_CHOICE') currentProgression.worldImpactXP += amount;

      currentProgression.experience += amount;
      currentProgression.totalExperience += amount;

      let leveledUp = false;
      let xpRequired = 100 + ((currentProgression.level - 1) * 75);
      
      while (currentProgression.experience >= xpRequired) {
        currentProgression.experience -= xpRequired;
        currentProgression.level += 1;
        currentProgression.skillPoints += 1;
        leveledUp = true;
        xpRequired = 100 + ((currentProgression.level - 1) * 75);
      }

      saveLocalProgression(currentProgression);
      return { progression: { ...currentProgression }, leveledUp };
    }
    return null;
  }

  async getProgression(): Promise<LocalProgression> {
    if (this.localFallback) {
      return loadLocalProgression();
    }
    return await this.init(); // fetch fresh or return local
  }

  async unlockAbility(
    abilityId: string,
    currentProgression: LocalProgression = loadLocalProgression()
  ): Promise<LocalProgression | null> {
    const ability = GAME_ABILITIES[abilityId];
    if (!ability) return null;

    if (currentProgression.unlockedAbilities.includes(abilityId)) return null;
    if (currentProgression.level < ability.levelRequirement) return null;
    if (currentProgression.skillPoints < ability.skillPointCost) return null;

    // 1. Backend flow
    try {
      const res = await unlockAbility(abilityId, ability.skillPointCost, ability.levelRequirement);
      if (res && res.success && res.data) {
        this.localFallback = false;
        saveLocalProgression(res.data);
        return res.data;
      }
    } catch (e) {
      console.warn('Backend ability unlock failed, falling back to local', e);
      this.localFallback = true;
    }

    // 2. Local fallback flow
    if (this.localFallback) {
      currentProgression.skillPoints -= ability.skillPointCost;
      currentProgression.unlockedAbilities.push(abilityId);
      saveLocalProgression(currentProgression);
      return { ...currentProgression };
    }
    return null;
  }
}

export const progressionSystem = new ProgressionSystem();
