import React from 'react';
import { render } from 'react-dom';

function App() {
  return (
    <div>
      <h1>Tic Tac Toe</h1>
    </div>
  );
}

render(<App />, document.querySelector('#root'));