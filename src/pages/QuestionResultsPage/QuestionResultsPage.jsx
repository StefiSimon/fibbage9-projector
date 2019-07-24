    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';
import checkmarkSvg from '../../assets/img/checkmark.svg';
import './QuestionResultsPage.scss';

import { getToupleFromSnapshot } from '../../lib/firebaseUtils';
import CheckMarks from '../../components/CheckMarks/CheckMarks';
import Animal from '../../shared/Animal/Animal';

const { game, question } = databaseRefs;

class QuestionResultsPage extends Component {
  gameRef = '';
  questionRef = '';

  state = {
    currentQuestion: '',
    fakeAnswers: [],
    players: [],
    correctAnswer: {}
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
        const { question, fakeAnswers, answer } = questionObj;
        if (question && fakeAnswers) {
          this.setState({
            currentQuestion: question,
            fakeAnswers: this.getAnswersList(fakeAnswers),
            correctAnswer: answer
          })
        }
      }
    })
  }

  componentWillUnmount() {
    this.gameRef.off("value");
    this.gameRef.child("/players").off('value');
    this.gameRef.child("/currentScreen").off('value');
    this.questionRef.off("value");
  }

  getAuthorTeamName = (teamId) => {
    const { players } = this.state;
    const authorPlayer = players.find(player => player[0] === teamId);

    if (!authorPlayer) return '';

    const [key, data] = authorPlayer;
    return data.nickname ? data.nickname : '';
  }

  getAuthorTeamAnimal = (teamId) => {
    const { players } = this.state;
    const authorPlayer = players.find(player => player[0] === teamId);

    if (!authorPlayer) return '';

    const [key, data] = authorPlayer;
    return data.animal ? data.animal.animal : '';
  }

  getAuthorTeamColor = (teamId) => {
    const { players } = this.state;
    const authorPlayer = players.find(player => player[0] === teamId);

    if (!authorPlayer) return '';

    const [key, data] = authorPlayer;
    return data.animal ? data.animal.color : '';
  }

  getVoterTeams = (teamIds) => {
    if (teamIds) {
      const teamIdsArray = getToupleFromSnapshot(teamIds);
      return teamIdsArray.map(team => {
        const [key, data] = team;
        return data.name ? this.getAuthorTeamName(data.name) : '';
      });
    }
    return ['no votes'];
  }

  getVoterAnimals = (teamIds) => {
    if (teamIds) {
      const teamIdsArray = getToupleFromSnapshot(teamIds);
      return teamIdsArray.map(team => {
        const [key, data] = team;
        return data.animal || '';
      });
    }
    return ['no animals :('];
  }

  getCorrectAnswerVotes = (votedBy) => {
    const teamIds = getToupleFromSnapshot(votedBy);
    return teamIds.map(id => {
      const [key, data] = id;
      return data;
    })
  }

  render() {
    const { currentQuestion, fakeAnswers, correctAnswer: { value, votedBy, voteCount } } = this.state;
    const correctAnswerVotes = this.getCorrectAnswerVotes(votedBy);
    return (
      <div>
        <img src={checkmarkSvg} alt="checkmark" className="image" />
        <CheckMarks className="up" style={{ top: '40%', right: '80%', width: '150px' }}/>
        <CheckMarks className="down" style={{ top: '10%', left: '80%', width: '100px' }}/>
        <div className="question-results-page">
          <div className="question">
            Answers for {`"${currentQuestion}" :`}
          </div>
          <div className="answer-info-card correct">
            <div className="answer">{value}</div>
            <div className="team-votes">
              {`Voted by ${voteCount ? voteCount : 0} teams`} 
              {correctAnswerVotes.map((team, i) => (
                <Fragment>
                  <span> </span>
                  <Animal className="voter-animal" animal={team.animal} />
                </Fragment>)
              )}
            </div>
          </div>
          {fakeAnswers.map((answer, i) => (
            <div key={i} className="answer-info-card">
              <div className="answer-info">
                <div style={{ color: this.getAuthorTeamColor(answer.authorTeam) }} className="answer">
                  {answer.value}
                </div>
                <div className="author">Added by <span style={{ color: this.getAuthorTeamColor(answer.authorTeam) }}>{this.getAuthorTeamName(answer.authorTeam)}</span></div>
                <div className="team-votes">
                  {`Voted by ${answer.voteCount} team(s) `} 
                  {this.getVoterTeams(answer.votedBy).map((team, i) => <span key={i}>{`${ team } `}</span>)}
                  {this.getVoterAnimals(answer.votedBy).map((animal, i) => <Animal className="voter-animal" key={i} animal={animal} />)}
                </div>
              </div>
              <Animal animal={this.getAuthorTeamAnimal(answer.authorTeam)} className="animal-svg" />
            </div>
          ))}
        </div>
      </div>
    )
  }
};

export default QuestionResultsPage;