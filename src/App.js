import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PincodeStartPage from '../src/pages/PincodeStartPage/PincodeStartPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="projector-header">
          Projector app header
        </header>
        <main>
          <Route exact path="/" component={PincodeStartPage} />
        </main>
      </div>
    </Router>
  );
}

export default App;
