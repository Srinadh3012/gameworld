export interface LocalStoryState {
  currentChapter: number;
  storyFlags: Record<string, any>;
  activeMissions: string[];
  completedMissions: string[];
  failedMissions: string[];
  choices: Record<string, string>;
  missionProgress: Record<string, string[]>; // missionId -> array of completed objective IDs
}

const DEFAULT_STORY_STATE: LocalStoryState = {
  currentChapter: 1,
  storyFlags: {},
  activeMissions: [],
  completedMissions: [],
  failedMissions: [],
  choices: {},
  missionProgress: {}
};

export function saveLocalStoryState(state: LocalStoryState): void {
  try {
    localStorage.setItem('gw_story_state', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save local story state', e);
  }
}

export function loadLocalStoryState(): LocalStoryState {
  try {
    const data = localStorage.getItem('gw_story_state');
    return data ? JSON.parse(data) : DEFAULT_STORY_STATE;
  } catch (e) {
    console.warn('Failed to load local story state', e);
    return DEFAULT_STORY_STATE;
  }
}
