import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  Page,
  Button,
  Range
} from 'react-onsenui';
import WalkingPage from '../containers/WalkingPage';
import NavBar from './NavBar';
import LocationList from '../containers/LocationList';
import * as Actions from '../actions';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 300,
      page: 1,
      timeSinceLastRefill: 0
    };
    this.rangeChange = this.rangeChange.bind(this);
    this.startPedometerClick = this.startPedometerClick.bind(this);
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
  rangeChange(e) {
    this.setState({
      value: e.target.value
    });
  }
  startPedometerClick() {
    const { actions, navigator } = this.props;
    actions.startPedometerUpdates();
    navigator.pushPage({component: WalkingPage});
  }
  render() {
    const { navigator } = this.props;
    const { value } = this.state;
    return (
      <Page renderToolbar={() => <NavBar title='Refill' navigator={navigator}/>}>
        <LocationList navigator={navigator}/>
        <div className='center-container'>
          <div className='info-container'>
            <h2>Dont walk to far without a waterhole break</h2>
          </div>
          <div className='range-container'>
            <p>Max {600 - value} steps between waterholes</p>
            <Range min='100' value={value} max='500' onChange={this.rangeChange}/>
            <div className='range-labels'>
              <span>VERY</span>
              <span>SUPER</span>
              <span>MEGA</span>
            </div>
          </div>
          <div className='button-container'>
            <Button modifier='outline' onClick={this.startPedometerClick}>Get going</Button>
          </div>
        </div>
      </Page>
    );
  }
};

MainPage.defaultProps = {
  numberOfSteps: 0,
  nbrOfRefills: 0,
  timeLastRefill: null
};

const mapStateToProps = (state) => ({
  running: state.pedometerReducer.running,
  numberOfSteps: state.pedometerReducer.numberOfSteps,
  startDate: state.pedometerReducer.startDate,
  nbrOfRefills: state.refill.nbrOfRefills,
  timeLastRefill: state.refill.timeLastRefill,
  name: state.name
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);

