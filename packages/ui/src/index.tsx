import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store/store';

render(<App />, document.getElementById('app'));

if ((module as any).hot) {
    (module as any).hot.accept();
}
render(
    <Provider store={store}>
            <App/>
    </Provider>,
    document.getElementById('app'),
);
