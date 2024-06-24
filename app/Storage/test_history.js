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

export const addHistory = (targetColor, selectedColor) => {
    const cards = getHistory();
    cards.push({
        timestamp: new Date().toISOString(),
        targetColor,
        selectedColor,
    });
    localStorage.setItem(storageKey, JSON.stringify(cards));
};

export const getHistory = () => {
    return loadResultsFromStorage();
};

// export const clearResults = () => {
//     localStorage.removeItem(storageKey);
// };