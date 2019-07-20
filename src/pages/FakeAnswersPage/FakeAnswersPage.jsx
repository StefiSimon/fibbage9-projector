    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';

import './FakeAnswersPage.scss';

import { getToupleFromSnapshot } from '../../lib/firebaseUtils';

const { game, question } = databaseRefs;

class FakeAnswersPage extends Component {
  gameRef = '';
  questionRef = '';

  state = {
    currentQuestion: '',
    fakeAnswers: []
  }

  getAnswersList = (toupleList) => {
    const list = getToupleFromSnapshot(toupleList);
    return list.map(item => {
      const [key, data] = item;
      return data && data.value ? data.value : '';
    })
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
        if (screenId === screensEnum.RESULTS) {
          history.push(route);
        }
      }
    })

    this.questionRef.on("value", snapshot => {
      const questionObj = snapshot.val();
      if (questionObj) {
        const { question, fakeAnswers } = questionObj;
        if (question && fakeAnswers) {
          this.setState({
            currentQuestion: question,
            fakeAnswers: this.getAnswersList(fakeAnswers)
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
    const { currentQuestion, fakeAnswers } = this.state;
    return (
      <div class="answers-page">
        <div class="question">
          {currentQuestion}
        </div>
        <div class="answers">
          {fakeAnswers.map((answer, index) => (
            <div key={index} class="fake-answer">
              <span class="counter">{`${index + 1}.`}</span>
              <span>{answer}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
};

export default FakeAnswersPage;