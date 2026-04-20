export const XP_PER_LEVEL = 100;

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

export const xpForNextLevel = (currentLevel: number): number => {
  return currentLevel * XP_PER_LEVEL;
};

export const xpProgressInCurrentLevel = (xp: number): number => {
  return xp % XP_PER_LEVEL;
};

export const xpProgressPercentage = (xp: number): number => {
  const progress = xpProgressInCurrentLevel(xp);
  return Math.round((progress / XP_PER_LEVEL) * 100);
};

export const addXP = (currentXP: number, earnedXP: number): { newXP: number; leveledUp: boolean; newLevel: number } => {
  const newXP = currentXP + earnedXP;
  const oldLevel = calculateLevel(currentXP);
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;
  
  return { newXP, leveledUp, newLevel };
};

// XP rewards for different actions
export const XP_REWARDS = {
  TASK_COMPLETE: 10,
  HABIT_COMPLETE: 15,
  MINI_GOAL_COMPLETE: 50,
  BOSS_GOAL_COMPLETE: 200,
  STUDY_SESSION_15MIN: 5,
  STUDY_SESSION_25MIN: 10,
  STUDY_SESSION_50MIN: 20,
};
