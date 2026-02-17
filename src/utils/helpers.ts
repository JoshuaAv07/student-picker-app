/**
 * Parse CSV file and extract student names
 */
export const parseCSV = (text: string): string[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
  const nameIndex = headers.indexOf('name');
  
  if (nameIndex === -1) {
    throw new Error('CSV must contain a "name" column');
  }

  return lines.slice(1)
    .map(line => {
      const values = line.split(',');
      return values[nameIndex]?.trim();
    })
    .filter(name => name && name.length > 0);
};

/**
 * Parse TXT file (one name per line)
 */
export const parseTXT = (text: string): string[] => {
  return text
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.trim());
};

/**
 * Load students from localStorage
 */
export const loadFromStorage = (key: string): string[] | null => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : null;
};

/**
 * Save students to localStorage
 */
export const saveToStorage = (key: string, data: string[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Clear specific key from localStorage
 */
export const clearFromStorage = (key: string): void => {
  localStorage.removeItem(key);
};
