    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../../lib/refs';
import screensEnum from '../../../lib/screensEnum';
import { pincodeIcon } from '../../../assets/img/pincode_icon.svg';

import './DisplayPincode.scss';
import { getToupleFromSnapshot } from '../../../lib/firebaseUtils';

const { game } = databaseRefs;

class DisplayPincode extends Component {
  gameRef = '';

  componentDidMount() {
    const { gameId } = this.props;
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
  }

  componentWillUnmount() {
    this.gameRef.off("value");
    this.gameRef.child("/currentScreen").off("value");
  }

  render() {
    const { pincode } = this.props;
    return (
      <div className="pincode-container">
        <div className="display-text">
          <div>Game pincode</div>
          <span className="pincode">{pincode}</span>
          <span className="pincode-description">
            In order to be able to join a game room you need to obtain a PINCODE from the creators of that game room.
            Also, Add a nickname for your team so we know what to display on the scoreboard. 
          </span>
        </div>
      </div>
    )
  }
};

export default DisplayPincode;