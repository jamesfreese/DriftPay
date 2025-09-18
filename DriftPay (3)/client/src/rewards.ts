
export interface Reward {
  id: string;
  name: string;
  type: 'Soundscape' | 'Avatar Pack' | 'Ritual Upgrade';
  icon: string;
  unlockHint: string;
}

export const allRewards: Reward[] = [
  // Soundscapes from Driftscapes
  { id: 'storm', name: 'Storm Drift', type: 'Soundscape', icon: '🌩️', unlockHint: 'Available by default.' },
  { id: 'whisper', name: 'Whisper Drift', type: 'Soundscape', icon: '🌲', unlockHint: 'Available by default.' },
  { id: 'flow', name: 'Flow Drift', type: 'Soundscape', icon: '💧', unlockHint: 'Log hydration for the first time.' },
  { id: 'tide', name: 'Tide Drift', type: 'Soundscape', icon: '🌊', unlockHint: 'Achieve a 3-night streak.' },
  { id: 'echo', name: 'Echo Drift', type: 'Soundscape', icon: '🎶', unlockHint: 'Journal 5 times.' },
  { id: 'blank', name: 'Blank Drift', type: 'Soundscape', icon: '⚪', unlockHint: 'Complete a sleep session of 6 hours or more.' },
  
  // Items from Market
  { id: 'emberBloom', name: 'Ember Bloom', type: 'Soundscape', icon: '🔥', unlockHint: 'Purchase from the Moon Light Market.' },
  { id: 'echoMask', name: 'Echo Mask', type: 'Avatar Pack', icon: '🎭', unlockHint: 'Purchase from the Moon Light Market.' },
  { id: 'driftpass', name: 'Driftpass', type: 'Ritual Upgrade', icon: '🎟️', unlockHint: 'Purchase from the Moon Light Market.' },
];
