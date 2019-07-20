    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';

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
      <Fragment>
        Scores so far:
        {this.getPlayersInfo().map(el => (
          <div>
            <span>Team: {el.nickname} </span>
            <span>Score: {el.totalScore}</span>
          </div>
        ))}
      </Fragment>
    )
  }
};

export default PartialScorePage;