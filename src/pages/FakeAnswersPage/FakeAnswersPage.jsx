    
import React, { Component } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';

import answerSvg from '../../assets/img/answer_svg.svg';

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

  getAnswersList = (toupleList, correctAnswer) => {
    const list = getToupleFromSnapshot(toupleList);
    return list.map(item => {
      const [key, data] = item;
      return data && data.value ? data.value : '';
    });
  }

  shuffleAnswers = (fakeAnswers, truth) => {
    const allAnswers = [...fakeAnswers, truth];
    const removeEmpty = allAnswers.filter(answer => !!answer);
    const sorted = removeEmpty.sort((a, b) => {
      if (a && b) {
        const firstValue = a.value ? a.value.toLowerCase() : a[1].value;
        const secondValue = b.value ? b.value.toLowerCase() : b[1].value;
  
        if (firstValue < secondValue) {
          return -1;
        } else if (firstValue > secondValue) {
          return 1;
        }
      }
      return 0;
    });
    return sorted;
  };

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
        const { question, fakeAnswers, answer: { value = '' } } = questionObj;
        if (question && fakeAnswers) {
          const fakeAnswersInfo = this.getAnswersList(fakeAnswers);
          this.setState({
            currentQuestion: question,
            fakeAnswers: this.shuffleAnswers(fakeAnswersInfo, value)
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
    const { currentQuestion, fakeAnswers = [] } = this.state;
    return (
      <div className="answers-page">
        <div className="question">
          {currentQuestion}
        </div>
        <div className="answers">
          {fakeAnswers.map((answer, index) => (
            <div key={index} className="fake-answer">
              <div className="counter">{index + 1}</div>
              <img src={answerSvg} alt="img" className="answer-line" />
              <div className="answer-square">{answer}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
};

export default FakeAnswersPage;