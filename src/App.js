import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from '../src/shared/Header/Header';
import PincodeStartPage from '../src/pages/PincodeStartPage/PincodeStartPage';
import QuestionPage from '../src/pages/QuestionPage/QuestionPage';
import FakeAnswersPage from '../src/pages/FakeAnswersPage/FakeAnswersPage';
import QuestionResultsPage from '../src/pages/QuestionResultsPage/QuestionResultsPage';
import PartialScorePage from '../src/pages/PartialScorePage/PartialScorePage';
import TotalScorePage from '../src/pages/TotalScorePage/TotalScorePage';

import './App.scss';

function App(props) {
  const [grayPage, setGrayPage] = useState(false);

  useEffect(() => {
    // TODO: improve logic
    // On certain pages, the background should be gray
    if (props.location) {
      setGrayPage(
        props.location.pathname.endsWith('results') ||
          props.location.pathname.endsWith('wait-players')
      );
    }
    
    // Each time the route changes, run this staggering animation
    anime({
      targets: '.page-transition-elem',
      translateY: [-15, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      easing: 'cubicBezier(0, 0.45, 0.74, 0.77)'
    });
  }, [props]);

  return (
    <Router>
      <div className={`App ${grayPage ? 'bg-gray' : ''}`}>
      <Header title="Fibbage9" subtitle="Welcome to FIBBAGE, Levi9 version" />
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
