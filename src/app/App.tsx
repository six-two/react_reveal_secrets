import React from 'react';
import '../css/app.scss';
import StepManager from './StepManager';

/*
TODOS
- add share length sanity check

IDEAS

NICE TO HAVES
- make it working on mobile (status: iOS fails, missing button for decrypt)
*/

function App() {
  return (
    <div className="app">
      <StepManager />
    </div>
  );
}

export default App;
