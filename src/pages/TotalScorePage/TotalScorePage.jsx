    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';

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
      <Fragment>
        WINNERS ARE:
        {this.getWinners().map(el => (
          <div>
            <span>Team: {el.nickname} </span>
            <span>Score: {el.totalScore}</span>
          </div>
        ))}
        Congrats also to everyone:
        {this.getOtherPlayers().map(el => (
          <div>
            <span>Team: {el.nickname} </span>
            <span>Score: {el.totalScore}</span>
          </div>
        ))}
      </Fragment>
    )
  }
};

export default TotalScorePage;