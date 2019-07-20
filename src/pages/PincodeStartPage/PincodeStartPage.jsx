import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import EnterPincode from './EnterPincode/EnterPincode';
import DisplayPincode from './DisplayPincode/DisplayPincode';
import { getToupleFromSnapshot } from '../../lib/firebaseUtils';

const { games } = databaseRefs;

class PincodeStartPage extends Component {
  state = {
    activeGames: [],
    hasPincode: false,
    pincode: 0,
    gameId: ''
  }

  componentDidMount() {
    games.on('value', snapshot => {
      this.setActiveGames(getToupleFromSnapshot(snapshot.val()));
    });
  }

  componentWillUnmount() {
    games.off();
  }

  getActiveGames = games => {
    return games
      .map(game => {
        const [key, gameData] = game;
        if (!gameData.isActive) return null;

        return game;
      })
      .filter(Boolean);
  };

  setActiveGames = games => {
    const activeGames = this.getActiveGames(games);
    this.setState({ activeGames });
  };

  handleInsertPincode = ({ pincode }, actions) => {
    let gameToJoin;
    const { activeGames } = this.state;
    const pincodeMatchGame = activeGames
      .filter(game => {
        const [key, data] = game;

        if (data.pincode === pincode) {
          gameToJoin = key;
          this.setState({
            gameId: key
          })
          return key;
        }

        return null;
      })
      .filter(Boolean);

    if (pincodeMatchGame.length === 1) {
      this.setState({
        hasPincode: true,
        pincode
      })
    } else {
      actions.setFieldError(
        'pincode',
        'There is no active game with this pincode.'
      );
    }
  }

  render() {
    const { history } = this.props;
    const { hasPincode, pincode, gameId } = this.state;
    return (
      <Fragment>
        { hasPincode ? 
            <DisplayPincode history={history} pincode={pincode} gameId={gameId} /> : 
            <EnterPincode onSubmit={this.handleInsertPincode} />
        }
      </Fragment>
    )
  }
}

export default PincodeStartPage;