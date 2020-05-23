import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(
    <App/>,
    document.getElementById('app'),
);

if ((module as any).hot) {
    (module as any).hot.accept('./App.tsx', () => {
        const NextApp = require('./App.js').App;
        render(<NextApp/>, document.getElementById('app'));
    });
}