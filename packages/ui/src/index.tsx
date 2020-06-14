import { IPCConstants } from '@botvy/framework/ipc/IPCConstants';
import { ITheme } from '@botvy/framework/theming/ITheme';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import '../../../node_modules/react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import App from './App';
import { ApplicationInitializator } from './ApplicationInitializator';
import ConnectedThemeProvider from './components/ConnectedThemeProvider';
import { store } from './store/store';
import { setTheme } from './store/theme/theme.actions';

const electron = window.require('electron');
electron.ipcRenderer.on(IPCConstants.Core.Theming.ThemeUpdated.toString(), (event, updatedTheme: ITheme) => {
    store.dispatch(setTheme(updatedTheme));
});

const applicationInitializator = new ApplicationInitializator(store);
applicationInitializator.initialize();

render(
    <Provider store={store}>
        <ConnectedThemeProvider>
            <App/>
        </ConnectedThemeProvider>
    </Provider>,
    document.getElementById('app'),
);
