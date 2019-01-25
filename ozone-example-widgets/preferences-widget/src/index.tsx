/// <reference path="./typings/owf-widget.d.ts" />

import React from 'react';
import ReactDOM from 'react-dom';

import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import './index.scss';


import PreferencesWidget from './components/PreferencesWidget';
import * as serviceWorker from './serviceWorker';

OWF.ready(() => {
    ReactDOM.render(<PreferencesWidget />, document.getElementById('root'));
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
