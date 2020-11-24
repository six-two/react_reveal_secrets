import React from 'react';
import '../css/app.scss';
import StepManager from './StepManager';

/*
TODOS
- add info how it works and how/why to use it
- make it look ok

IDEAS
- have different input methods (text field / area, file)
- have different share output formats (files, zip, text (base64, hex))

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
