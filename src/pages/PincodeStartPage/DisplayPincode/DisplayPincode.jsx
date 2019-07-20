    
import React, { Component, Fragment } from 'react';
import { databaseRefs } from '../../../lib/refs';
import screensEnum from '../../../lib/screensEnum';

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
  }

  render() {
    const { pincode } = this.props;
    return (
      <Fragment>
        Enter this pincode: {pincode}
      </Fragment>
    )
  }
};

export default DisplayPincode;