const storageKey = 'color-test-settings';

const loadResultsFromStorage = () => {
    const storedResults = localStorage.getItem(storageKey);

    return storedResults ? JSON.parse(storedResults) : {};
};

// { mode, difficulty, testNum, practicing, saveToHistory, textMethod, useColorWheel }
export const changeSettings = (setting) => {
    localStorage.setItem(storageKey, JSON.stringify(setting));
};

export const getSettings = (last = Infinity) => {
    return loadResultsFromStorage();
};

// export const clearResults = () => {
//     localStorage.removeItem(storageKey);
// };