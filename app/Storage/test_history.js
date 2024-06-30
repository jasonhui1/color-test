let cachedResults = null;
const storageKey = 'color-test-history';
//Load from local storage only if not yet loaded
const loadResultsFromStorage = () => {
    if (cachedResults === null) {
        const storedResults = localStorage.getItem(storageKey);
        cachedResults = storedResults ? JSON.parse(storedResults) : [];
    }
    return cachedResults;
};

export const addHistory = (targetColor, selectedColor, mode = 'normal', testId) => {
    const cards = getFullHistory()||[];
    cards.push({
        timestamp: new Date().toISOString(),
        testId,
        targetColor,
        selectedColor,
        mode,
    });
    localStorage.setItem(storageKey, JSON.stringify(cards));
};

const getFullHistory = () => {
    return loadResultsFromStorage();
};

export const getHistory = ({ testId, mode = 'normal', last = Infinity }) => {
    let history = loadResultsFromStorage();
    if (last != Infinity) {
        return history.slice(-last);
    }

    if (testId) history = history.filter(history => history.testId === testId);
    if (mode) history = history.filter(history => history.mode === mode);

    return history;
};

// export const clearResults = () => {
//     localStorage.removeItem(storageKey);
// };