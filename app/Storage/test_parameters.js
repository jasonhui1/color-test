let cachedResults = null;
const storageKey = 'color-test-para';

//Load from local storage only if not yet loaded
const loadResultsFromStorage = () => {
    if (cachedResults === null) {
        const storedResults = localStorage.getItem(storageKey);
        cachedResults = storedResults ? JSON.parse(storedResults) : [];
    }
    return cachedResults;
};

export const addNewTest = (id, hRange, lRange, sRange, name = 'Unnamed') => {
    const tests = getTests();
    tests.push({
        id, hRange, sRange, lRange,
        name
    });
    localStorage.setItem(storageKey, JSON.stringify(tests));
};

export const getTests = (last = Infinity) => {
    const tests = loadResultsFromStorage();
    if (last != Infinity) {
        return tests.slice(-last);
    }
    return tests;
};

// export const clearResults = () => {
//     localStorage.removeItem(storageKey);
// };