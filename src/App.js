import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PincodeStartPage from '../src/pages/PincodeStartPage/PincodeStartPage';
import QuestionPage from '../src/pages/QuestionPage/QuestionPage';
import FakeAnswersPage from '../src/pages/FakeAnswersPage/FakeAnswersPage';
import QuestionResultsPage from '../src/pages/QuestionResultsPage/QuestionResultsPage';
import PartialScorePage from '../src/pages/PartialScorePage/PartialScorePage';
import TotalScorePage from '../src/pages/TotalScorePage/TotalScorePage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="projector-header">
          Projector app header
        </header>
        <main>
          <Route exact path="/" component={PincodeStartPage} />
          <Route exact path="/lobby/:gameId/questions/:questionId/addAnswer" component={QuestionPage} />
          <Route exact path="/lobby/:gameId/:questionId/pick-answer" component={FakeAnswersPage} />
          <Route exact path="/lobby/:gameId/questions/:questionId/results" component={QuestionResultsPage} /> 
          <Route exact path="/lobby/:gameId/questions/:questionId/score" component={PartialScorePage} />
          <Route exact path="/lobby/:gameId/total-score" component={TotalScorePage} />
        </main>
      </div>
    </Router>
  );
}

export default App;
