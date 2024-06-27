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
    const cards = getHistory();
    cards.push({
        timestamp: new Date().toISOString(),
        testId,
        targetColor,
        selectedColor,
        mode,
    });
    localStorage.setItem(storageKey, JSON.stringify(cards));
};

export const getHistory = (last = Infinity) => {
    const history = loadResultsFromStorage();
    if (last != Infinity) {
        return history.slice(-last);
    }
    return history;
};

// export const clearResults = () => {
//     localStorage.removeItem(storageKey);
// };