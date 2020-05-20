import { app, BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

/**
 * The electron window
 */
let mainWindow: BrowserWindow;

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

/**
 * Installs the react and redux chrome extension in electron
 */
function installDeveloperTools() {
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach((element) => {
        /* tslint:disable */
        installExtension(element).then(({ name }: any) => {
            console.log(`Added extension: ${name}`);
        }).catch((err: Error) => {
            console.log('An error occurred: ', err);
        });
        /* tslint:enable */
    });
}
