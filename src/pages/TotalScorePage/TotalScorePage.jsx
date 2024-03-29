import React, { Component, Fragment } from 'react';
import anime from 'animejs';
import confetti from 'canvas-confetti';
import { databaseRefs } from '../../lib/refs';
import { getToupleFromSnapshot } from '../../lib/firebaseUtils';
import Animal from '../../shared/Animal/Animal';
import Card from '../../shared/Card/Card';

import FirstPlaceCrown from '../../shared/assets/svg/first-place.svg';
import SecondPlaceCrown from '../../shared/assets/svg/second-place.svg';

import './TotalScorePage.scss';

const { players } = databaseRefs;

const dimensions = { height: 72, width: 72 };
const confettiDuration = 5;

class TotalScorePage extends Component {
  state = {
    players: [],
    sortedPlayers: []
  };

  getPlayersInfo = players => {
    return players.map(el => el[1]);
  };

  redirectToHome = () => {
    const { history } = this.props;
    history.push('/');
  };

  sortPlayersByScore = players =>
    players.sort((player1, player2) => player2.totalScore - player1.totalScore);

  renderListOfPlayers = () => {
    const { players } = this.state;

    if (!players || players.length === 0) {
      return [];
    }

    return players
      .sort((player1, player2) => player2.totalScore - player1.totalScore)
      .map((player, index) => {
        const color = player.animal ? player.animal.color : '';

        const style = {
          color: color,
          border: `2px solid ${color}`
        };

        return (
          <Fragment key={player.animal.animal}>
            {index <= 1 && (
              <div className="winner o-layout--center o-layout--stretch u-1/2">
                {index === 0 && <img src={FirstPlaceCrown} alt="first-place" />}
                {index === 1 && <img src={SecondPlaceCrown} alt="second-place" />}

                <Card
                  className="u-1/1 u-margin-bottom-small u-1/1 u-weight-bold card cancer"
                  style={style}
                >
                  <div className="card--left">
                    <div className="u-h4 u-margin-bottom-small">{player.nickname}</div>
                    <div className="u-h5">SCORE: {player.totalScore}</div>
                  </div>

                  <div className="card--right">
                    <Animal
                      className="u-margin-right-small"
                      style={dimensions}
                      animal={player.animal.animal}
                    />
                  </div>
                </Card>

                {index === 1 && (
                  <h1 className="u-h4 u-margin-top-small u-color-main">Better luck next time</h1>
                )}
              </div>
            )}
            {index > 1 && (
              <div className="grid-item loser">
                <Card
                  className="u-1/1 u-margin-bottom-small cancer-container"
                  style={{ ...style, padding: '6px' }}
                >
                  <div className="u-h6 u-margin-bottom-small">{player.nickname}</div>

                  <Animal
                    className="u-margin-bottom-small"
                    style={dimensions}
                    animal={player.animal.animal}
                  />

                  <div className="u-h5">SCORE: {player.totalScore}</div>
                </Card>
              </div>
            )}
          </Fragment>
        );
      });
  };

  componentDidMount() {
    const end = Date.now() + confettiDuration * 1000;
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: {
          x: 0
        }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: {
          x: 1
        }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    const {
      match: {
        params: { gameId }
      }
    } = this.props;
    const playersRef = players(gameId);

    playersRef.on('value', snapshot => {
      const playersSnapshot = snapshot.val();
      const playersInfo = this.getPlayersInfo(getToupleFromSnapshot(playersSnapshot));
      const sortedPlayers = this.sortPlayersByScore(playersInfo);
      this.setState({ players: playersInfo, sortedPlayers }, () => {
        anime({
          targets: '.winner',
          translateX: [-100, 0],
          opacity: [0, 1],
          delay: anime.stagger(100),
          easing: 'easeInOutQuint',
          duration: 800
        });

        anime({
          display: 'inline-flex',
          targets: '.loser',
          translateY: [30, 0],
          opacity: [0, 1],
          delay: anime.stagger(100),
          easing: 'easeInOutQuint',
          duration: 800
        });
      });
    });
  }

  componentWillUnmount() {
    if (this.playersRef) {
      this.playersRef.off();
    }
  }

  render() {
    const { sortedPlayers } = this.state;
    return (
      <div className="total-score-page">
        <div className="start-new-game" onClick={this.redirectToHome}>
          Start new game
        </div>
        {this.renderListOfPlayers()}
      </div>
    );
  }
}

export default TotalScorePage;
