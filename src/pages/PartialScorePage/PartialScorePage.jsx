    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';

import './PartialScorePage.scss';

import { getToupleFromSnapshot } from '../../lib/firebaseUtils';

const { game } = databaseRefs;

class PartialScorePage extends Component {
  gameRef = '';

  state = {
    players: []
  }

  componentDidMount() {
    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    this.gameRef = game(gameId);

    this.gameRef.child("/currentScreen").on("value", snapshot => {
      const { history } = this.props;
      if (snapshot.val()) {
        const { screenId, route } = snapshot.val();
        if (screenId === screensEnum.ANSWER) {
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
  }

  componentWillUnmount() {
    this.gameRef.off("value");
  }

  sortPlayersByScore = (players) => players.sort((player1, player2) => player2.totalScore - player1.totalScore);

  getPlayersInfo = () => {
    const { players } = this.state;
    const playersData = players.map(player => {
      const [key, data] = player;
      return data;
    });
    return this.sortPlayersByScore(playersData);
  }

  render() {
    return (
      <div class="partial-score-page">
        <div class="title"> 
          Scores so far
        </div>
        {this.getPlayersInfo().map(el => (
          <div class="team-card">
            <div class="team-name">{el.nickname}</div>
            <div>Score {el.totalScore}</div>
          </div>
        ))}
      </div>
    )
  }
};

export default PartialScorePage;