import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import '../../../node_modules/react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import App from './App';
import { ApplicationInitializator } from './ApplicationInitializator';
import ConnectedThemeProvider from './components/ConnectedThemeProvider';
import { store } from './store/store';

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
