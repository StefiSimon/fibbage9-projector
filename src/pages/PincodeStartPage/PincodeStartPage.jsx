import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../lib/refs';
import EnterPincode from './EnterPincode/EnterPincode';
import DisplayPincode from './DisplayPincode/DisplayPincode';
import { getToupleFromSnapshot } from '../../lib/firebaseUtils';
import Rocket from '../../components/Rocket/Rocket';
import Moon from '../../components/Moon/Moon';

import './PincodeStartPage.scss';

const { games } = databaseRefs;

class PincodeStartPage extends Component {
  state = {
    activeGames: [],
    hasPincodeAndUrl: false,
    pincode: 0,
    url: '',
    gameId: '',
    rocketActive: false
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

  handleInsertElements = ({ pincode, url }, actions) => {
    let gameToJoin;
    const { activeGames } = this.state;
    const pincodeMatchGame = activeGames
      .filter(game => {
        const [key, data] = game;

        if (data.pincode === pincode) {
          gameToJoin = key;
          this.setState({
            gameId: key,
          })
          return key;
        }

        return null;
      })
      .filter(Boolean);

    if (pincodeMatchGame.length === 1 && url && url.length > 0) {
      this.setState({
        hasPincodeAndUrl: true,
        pincode,
        url
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
    const { hasPincodeAndUrl, pincode, gameId, url } = this.state;
    return (
      <div className="startpage-container">
        <Rocket active={false} />
        <Moon top="30px" right="10px" width="75px" height="75px" />
        <Moon top="50px" left="50%" />
        <Moon left="10%" top="350px" width="50px" height="50px" />
        { hasPincodeAndUrl ? 
            <DisplayPincode history={history} pincode={pincode} gameId={gameId} url={url} /> : 
            <EnterPincode onSubmit={this.handleInsertElements} />
        }
      </div>
    )
  }
}

export default PincodeStartPage;