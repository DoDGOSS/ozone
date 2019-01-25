import React from 'react';
import ReactDOM from 'react-dom';
import PreferencesWidget from './PreferencesWidget';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PreferencesWidget />, div);
  ReactDOM.unmountComponentAtNode(div);
});
