    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';

import './QuestionPage.scss';

import { getToupleFromSnapshot } from '../../lib/firebaseUtils';

const { game, question } = databaseRefs;

class QuestionPage extends Component {
  gameRef = '';
  questionRef = '';

  state = {
    currentScore: 0,
    currentQuestion: ''
  }

  componentDidMount() {
    const {
      match: {
        params: { gameId, questionId }
      }
    } = this.props;
    this.gameRef = game(gameId);
    this.questionRef = question(gameId, questionId);

    this.gameRef.child("/currentScreen").on("value", snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { screenId, route } = snapshot.val();
        if (screenId === screensEnum.PICK_ANSWER) {
          history.push(route);
        }
      }
    })

    this.questionRef.on("value", snapshot => {
      const questionObj = snapshot.val();
      if (questionObj) {
        const { question, score } = questionObj;
        if (question && score) {
          this.setState({
            currentScore: score,
            currentQuestion: questionObj.question
          })
        }
      }
    })
  }

  componentWillUnmount() {
    this.gameRef.off("value");
    this.questionRef.off("value");
  }

  render() {
    const { currentQuestion, currentScore } = this.state;
    return (
      <Fragment>
        <div className="question-container">
          <div class="question">
            {currentQuestion}
          </div>
          <div class="question-points">
            Points for this question: <span>{currentScore}</span>
          </div>
          <div class="question-indications">
            Answer the question now, preferably with
            some bullshit answer to trick other
            team into picking your bullshit and get
            points when they do it
          </div>
        </div>
      </Fragment>
    )
  }
};

export default QuestionPage;