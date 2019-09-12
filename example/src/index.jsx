import * as React from 'react';
import { render } from 'react-dom';
import Header from './Header';

function App() {
  return (
    <div>
      <Header>React refresh plugin successfully loaded!</Header>
    </div>
  );
}

render(<App />, document.getElementById('app'));
