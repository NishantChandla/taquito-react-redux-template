import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

ReactDOM.render(
    (<Provider store={createStore(reducers, applyMiddleware(thunk))}>
        <App/>
    </Provider>), 
document.querySelector('#root'));