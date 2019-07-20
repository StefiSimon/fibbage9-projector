    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';

import './QuestionResultsPage.scss';

import { getToupleFromSnapshot } from '../../lib/firebaseUtils';

const { game, question } = databaseRefs;

class QuestionResultsPage extends Component {
  gameRef = '';
  questionRef = '';

  state = {
    currentQuestion: '',
    fakeAnswers: [],
    players: []
  }

  getAnswersList = (toupleList) => {
    const list = getToupleFromSnapshot(toupleList);
    return list && list.length ? list.map(item => {
      const [key, data] = item;
      return data;
    }) : [];
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
        if ([screensEnum.SCORE, screensEnum.FINAL_SCORE].includes(screenId)) {
          history.push(route);
        }
      }
    })

    this.gameRef.child("/players").on("value", snapshot => {
      if (snapshot.val()) {
        this.setState({
          players: getToupleFromSnapshot(snapshot.val())
        })
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

  getAuthorTeam = (teamId) => {
    const { players } = this.state;
    const authorPlayer = players.find(player => player[0] === teamId);

    if (!authorPlayer) return '';

    const [key, data] = authorPlayer;
    return data.nickname ? data.nickname : '';
  }

  getVoterTeams = (teamIds) => {
    if (teamIds) {
      const teamIdsArray = getToupleFromSnapshot(teamIds);
      return teamIdsArray.map(team => team[1] ? team[1] : '');
    }
    return ['this answer has no votes'];
  }

  render() {
    const { currentQuestion, fakeAnswers } = this.state;
    return (
      <div className="question-results-page">
        <div className="question">
          Answers for {`"${currentQuestion}" :`}
        </div>
        {fakeAnswers.map((answer, i) => (
          <div key={i} className="answer-info-card">
            <div className="answer">{answer.value}</div>
            <div className="author">Added by <span>{this.getAuthorTeam(answer.authorTeam)}</span></div>
            <div className="votes">Number of votes {answer.voteCount}</div>
            <div className="team-votes">
              {"Voted by "} 
              {this.getVoterTeams(answer.votedBy).map((team, i) => <span key={i}>{`${ team } `}</span>)}
            </div>
          </div>
        ))}
      </div>
    )
  }
};

export default QuestionResultsPage;