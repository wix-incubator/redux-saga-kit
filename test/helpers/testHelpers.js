export const delay = (ms = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};