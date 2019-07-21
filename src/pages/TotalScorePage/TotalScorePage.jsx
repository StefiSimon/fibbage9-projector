    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';

import './TotalScorePage.scss';

import { getToupleFromSnapshot } from '../../lib/firebaseUtils';

const { game } = databaseRefs;

class TotalScorePage extends Component {
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
    this.gameRef.child("/players").off('value');
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

  getWinners = () => {
    const playersInfo = this.getPlayersInfo();
    return playersInfo.slice(0, 2);
  }

  getOtherPlayers = () => {
    const playersInfo = this.getPlayersInfo();
    return playersInfo.slice(2, playersInfo.length);
  }

  render() {
    return (
      <div class="total-score-page">
        <div class="score-header">
          Winners
        </div>
        {this.getWinners().map(el => (
          <div class="winner-group">
            <div>{el.nickname} </div>
            <div>Final score: {el.totalScore}</div>
          </div>
        ))}
        <div class="score-header">
          Congrats to everyone else
        </div>
        {this.getOtherPlayers().map(el => (
          <div class="team-group">
            <div>{el.nickname} </div>
            <div>Score: {el.totalScore}</div>
          </div>
        ))}
      </div>
    )
  }
};

export default TotalScorePage;