/**
 * A simple function which gives access to window actions (like minimize,
 * maximize and close) for the electron window
 */
export const useElectron = () => {
    const electron = window.require('electron');
    const currentWindow = electron.remote.getCurrentWindow();

    return {
        minimize: () => {
            currentWindow.minimize();
        },
        maximize: () => {
            currentWindow.maximize();
        },
        close: () => {
            currentWindow.close();
        },
    };
};
