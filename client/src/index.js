import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Search from './js/search.js';
import Sidenav from './js/sidenav.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Search />, document.getElementById('root'));
ReactDOM.render(<Sidenav />, document.getElementById('sidenav'));


// ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load fasteryou can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
