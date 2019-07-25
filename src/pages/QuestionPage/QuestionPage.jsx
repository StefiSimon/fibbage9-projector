import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';
import QuestionMark from '../../components/QuestionMark/QuestionMark';

import questionSvg from '../../assets/img/question.svg';
import Timer from '../../shared/Timer';
import { getToupleFromSnapshot } from '../../lib/firebaseUtils';

import './QuestionPage.scss';

const { game, question } = databaseRefs;

class QuestionPage extends Component {
  gameRef = '';
  questionRef = '';

  state = {
    currentScore: 0,
    currentQuestion: '',
    endTimeDate: ''
  };

  componentDidMount() {
    const {
      match: {
        params: { gameId, questionId }
      }
    } = this.props;
    this.gameRef = game(gameId);
    this.questionRef = question(gameId, questionId);

    this.gameRef.child('/timer/endTime').on('value', snapshot => {
      this.setState({ endTimeDate: snapshot.val() });
    });

    this.gameRef.child('/currentScreen').on('value', snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { screenId, route } = snapshot.val();
        if (screenId === screensEnum.PICK_ANSWER) {
          history.push(route);
        }
      }
    });

    this.questionRef.on('value', snapshot => {
      const questionObj = snapshot.val();
      if (questionObj) {
        const { question, score } = questionObj;
        if (question && score) {
          this.setState({
            currentScore: score,
            currentQuestion: questionObj.question
          });
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.gameRef) {
      this.gameRef.off();
      this.gameRef.child('/timer/endTime').off('value');
      this.gameRef.child('/currentScreen').off('value');
    }

    if (this.questionRef) {
      this.questionRef.off();
    }
  }

  render() {
    const { currentQuestion, currentScore, endTimeDate } = this.state;
    return (
      <Fragment>
        {endTimeDate && <Timer endTime={endTimeDate} />}
        <div className="question-container">
          <QuestionMark style={{ top: '200px', right: '30px' }} className="down" />
          <QuestionMark style={{ top: '50%', right: '90%' }} className="up" />
          <QuestionMark style={{ top: '10%', right: '50%' }} className="down" />
          <img src={questionSvg} alt="question" className="question-svg" />
          <div className="question">{currentQuestion}</div>
          <div className="question-points">
            Points for this question: <span>{currentScore}</span>
          </div>
          <div className="question-indications">
            Answer the question now, preferably with some bullshit answer to trick other team into
            picking your bullshit and get points when they do it
          </div>
        </div>
      </Fragment>
    );
  }
}

export default QuestionPage;
