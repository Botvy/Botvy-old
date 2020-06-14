import 'reflect-metadata';

import { ServiceConstants } from '@botvy/framework/dist/ioc/ServiceConstants';
import { IPCConstants } from '@botvy/framework/dist/ipc/IPCConstants';
import { IPCEventHandler } from '@botvy/framework/dist/ipc/IPCEventHandler';
import { configureLogger } from '@botvy/framework/dist/logging/logger';
import { ThemeManager } from '@botvy/framework/dist/theming/ThemeManager';
import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import { basename } from 'path';
import { Logger } from 'winston';

import { getClientContainer } from './ioc/container';

/**
 * The electron window
 */
let mainWindow: BrowserWindow;

(async () => {
    const container = await getClientContainer();
    const themeManager = container.get(ThemeManager);
    const logger = container.get<Logger>(ServiceConstants.System.Logger);
    configureLogger(logger, 'Client');

    themeManager.fileChangeListener = (event: string, fileName: string) => {
        try {
            const themeName = basename(fileName, '.json');
            const updatedTheme = themeManager.loadTheme(themeName);

            mainWindow.webContents.send(
                IPCConstants.Core.Theming.ThemeUpdated.toString(),
                updatedTheme,
            );
        } catch (error) {
            logger.error(error);
        }
    };

    try {
        const ipcEventHandlers = container.getAll(IPCEventHandler);

        ipcEventHandlers.forEach((eventHandler) => {
            ipcMain.handle(eventHandler.eventName, eventHandler.handleEvent);
        });
    } catch (error) {
        logger.error(`Could not start the client: ${error}`);
        process.exit(1);
    }
})();

/**
 * Installs the react and redux chrome extension in electron
 */
function installDeveloperTools() {
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach((element) => {
        /* tslint:disable */
        installExtension(element)
            .then(({ name }: any) => {
                console.log(`Added extension: ${name}`);
            })
            .catch((err: Error) => {
                console.log('An error occurred: ', err);
            });
        /* tslint:enable */
    });
}

/**
 * Gets called when the electron window is ready to show
 */
function onReady() {
    const name = 'Botvy';

    app.setName(name);

    mainWindow = new BrowserWindow({
        height: 600,
        title: name,
        width: 800,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
            backgroundThrottling: false,
        },
    });

    let urlToLoad = '';

    if (!app.isPackaged) {
        // When the application is not packed we set the url to the webpack-dev-server
        urlToLoad = 'http://localhost:9000';
    } else {
        // Set the url to the packed index.html
        urlToLoad = `file://${__dirname}/index.html`;
    }

    // Load developer extensions
    installDeveloperTools();

    mainWindow.loadURL(urlToLoad);
    mainWindow.on('close', () => {
        app.quit();
    });
}

app.on('ready', () => onReady());
app.on('window-all-closed', () => app.quit());
