const STORAGE_KEY = 'student-planner-data';

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    const existingData = loadAllFromStorage();
    existingData[key] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = loadAllFromStorage();
    return data[key] !== undefined ? data[key] as T : defaultValue;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return defaultValue;
  }
};

export const loadAllFromStorage = (): Record<string, unknown> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading from storage:', error);
    return {};
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
