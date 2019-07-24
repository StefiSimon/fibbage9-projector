    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import screensEnum from '../../lib/screensEnum';

import piechartSvg from '../../assets/img/piechart.svg';

import './PartialScorePage.scss';

import { getToupleFromSnapshot } from '../../lib/firebaseUtils';
import Animal from '../../shared/Animal/Animal';
import FloatBaloon from '../../components/FloatBaloon/FloatBaloon';

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
    this.gameRef.child("/currentScreen").off("value");
    this.gameRef.child("/players").off("value");
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
      <div className="partial-score-page">
        <FloatBaloon style={{ top: "40%", right: "90%", width: '200px' }} className="up" />
        <img src={piechartSvg} className="score-img" alt="piechart" />
        <div className="title"> 
          Scores so far
        </div>
        <div className="card-container">
          {this.getPlayersInfo().map((el, index) => (
            <div className="team-card">
              <Animal animal={el.animal.animal} className="animal-svg" />
              <div className="team-info">
                <div style={{ color: el.animal.color }} className="team-name">{el.nickname}</div>
                <div className="score">
                  <span style={{ color: el.animal.color }}>
                    {`${el.totalScore}  `} 
                  </span>
                  points
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
};

export default PartialScorePage;