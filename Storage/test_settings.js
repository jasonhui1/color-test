const storageKey = 'color-test-settings';

const loadResultsFromStorage = () => {
    const storedResults = localStorage.getItem(storageKey);

    return storedResults ? JSON.parse(storedResults) : {};
};


export const changeSettings = ({ mode, difficulty, testNum, practicing, saveToHistory }) => {
    const settings = getSettings();

    if (mode !== null) settings.mode = mode;
    if (difficulty !== null) settings.difficulty = difficulty;
    if (testNum !== null) settings.testNum = testNum;
    if (practicing !== null) settings.practicing = practicing;
    if (saveToHistory !== null) settings.saveToHistory = saveToHistory;
    localStorage.setItem(storageKey, JSON.stringify(settings));
};

export const getSettings = (last = Infinity) => {
    return loadResultsFromStorage();
};

// export const clearResults = () => {
//     localStorage.removeItem(storageKey);
// };