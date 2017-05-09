import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  Page,
  Button,
  ProgressCircular
} from 'react-onsenui';
import NavBar from '../components/NavBar';
import LocationList from '../containers/LocationList';
import * as Actions from '../actions';

class WalkingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 300,
      timeSinceLastRefill: 0
    };
    this.startPedometerClick = this.startPedometerClick.bind(this);
    this.stopPedometerClick = this.stopPedometerClick.bind(this);
    this.refillClick = this.refillClick.bind(this);
  }
  componentWillUpdate(nextProps) {
    const { timeLastRefill } = nextProps;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (timeLastRefill) {
        this.setState({
          timeSinceLastRefill: Math.floor((new Date().getTime() - timeLastRefill) / 60000)
        });
      } else {
        this.setState({
          timeSinceLastRefill: '∞'
        });
      }
    }, 1000);
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { running, numberOfSteps, nbrOfRefills } = this.props;
    const { timeSinceLastRefill, value } = this.state;
    if (nextProps.running !== running ||
      nextProps.numberOfSteps !== numberOfSteps ||
      nextProps.nbrOfRefills !== nbrOfRefills ||
      nextState.value !== value ||
      nextState.timeSinceLastRefill !== timeSinceLastRefill) {
      return true;
    } else {
      return false;
    }
  }
  startPedometerClick() {
    const { actions } = this.props;
    actions.startPedometerUpdates();
  }
  stopPedometerClick() {
    const { actions } = this.props;
    actions.stopPedometerUpdates();
  }
  resetPedometerClick() {
    const { actions } = this.props;
    actions.resetPedometerUpdates();
  }
  refillClick() {
    const { actions } = this.props;
    actions.refill();
    actions.stopPedometerUpdates();
    actions.startPedometerUpdates();
  }
  render() {
    const { navigator, numberOfSteps, nbrOfRefills, timeLastRefill } = this.props;
    const { value, timeSinceLastRefill } = this.state;
    return (
      <Page renderToolbar={() => <NavBar backButton={true} title='Going on in' navigator={navigator}/>}>
        <LocationList navigator={navigator}/>
        <div className='center-container'>
          <div className='progress-container'>
            <ProgressCircular value={(100 / value) * numberOfSteps } secondaryValue={100}/>
            <div className='progress-container-steps'>
              <div className='number-of-steps'>{numberOfSteps}</div>
              <div className='number-of-steps-label'>STEPS</div>
            </div>
          </div>
          <div className='button-container'>
            <Button modifier='outline' onClick={this.resetPedometerClick}>Done</Button>
            <Button modifier='outline' onClick={this.refillClick}>Refill</Button>
          </div>
          <div className='summary-container'>
            {timeLastRefill &&
            <div>Time since last refill {timeSinceLastRefill} m</div>
            }
            {!timeLastRefill &&
            <div>No refills yet</div>
            }
            <div>Todays total:</div>
            <div>{numberOfSteps} steps {nbrOfRefills} number of refills</div>
          </div>
        </div>
      </Page>
    );
  }
};

WalkingPage.defaultProps = {
  numberOfSteps: 0,
  nbrOfRefills: 0,
  timeLastRefill: null
};

const mapStateToProps = (state) => ({
  running: state.pedometerReducer.running,
  numberOfSteps: state.pedometerReducer.numberOfSteps,
  startDate: state.pedometerReducer.startDate,
  nbrOfRefills: state.refill.nbrOfRefills,
  timeLastRefill: state.refill.timeLastRefill
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(WalkingPage);

