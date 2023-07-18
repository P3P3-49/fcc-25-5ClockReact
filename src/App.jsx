import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  class TimeLengthControl extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      let type = this.props.type;
      let typeUpper = type[0].toUpperCase() + type.slice(1);
      let isBreak = true;
      if (type === "session") isBreak = false;
      return (
        <div class="container card mx-auto #fff59d">
            <div>
              <div className="length-container fs-5">
                <div className="card-header shadow-sm mb-4 indigo white-text">
                  <h2 id={type + "-label"}>{typeUpper + " Length"}</h2>
                </div>
                <div className="length-controls">
                  <p id={type + "-length"} className="length-number fw-bold fs-1">
                    {this.props.length}
                  </p>
                  <button
                    id={type + "-decrement"}
                    onClick={() => this.props.handleDec(isBreak)}
                    className="waves-effect waves-light btn red">
                      <i className="material-icons">exposure_neg_1</i>
                  </button>
                  <button
                    id={type + "-increment"}
                    onClick={() => this.props.handleInc(isBreak)}
                    className="waves-effect waves-light btn green">
                      <i className="material-icons">exposure_plus_1</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
      );
    }
  }
  
  class App extends React.Component {
    constructor(props) {
      super(props);
  
      this.INTERVALID = 0;
      this.beep;
      this.state = {
        break: 5,
        session: 25,
        duringSession: true,
        secondsRemaining: 25 * 60,
        paused: true
      };
  
      this.handleDecrement = this.handleDecrement.bind(this);
      this.handleIncrement = this.handleIncrement.bind(this);
      this.handleInterval = this.handleInterval.bind(this);
      this.handlePause = this.handlePause.bind(this);
      this.handleReset = this.handleReset.bind(this);
    }
  

    handleDecrement(isBreak) {
      if (this.state.paused) {
        if (isBreak) {
          if (this.state.break > 1) {
            this.setState({
              break: this.state.break - 1
            });
          }
        } else {
          if (this.state.session > 1) {
            if (this.state.duringSession) {
              this.setState({
                session: this.state.session - 1,
                secondsRemaining: (this.state.session - 1) * 60
              });
            } else {
              this.setState({
                session: this.state.session - 1
              });
            }
          }
        }
      }
    }
  
    handleIncrement(isBreak) {
      if (this.state.paused) {
        if (isBreak) {
          if (this.state.break < 60) {
            this.setState({
              break: this.state.break + 1
            });
          }
        } else {
          if (this.state.session < 60) {
            if (this.state.duringSession) {
              this.setState({
                session: this.state.session + 1,
                secondsRemaining: (this.state.session + 1) * 60
              });
            } else {
              this.setState({
                session: this.state.session + 1
              });
            }
          }
        }
      }
    }
  
    handleInterval() {
      let secondsRemaining = this.state.secondsRemaining;
      if (secondsRemaining <= 0) {
        this.playBeep();
        clearInterval(this.INTERVALID);
        if (this.state.duringSession) {
          this.startBreak();
        } else {
          this.startSession();
        }
      } else {
        secondsRemaining--;
        this.setState({ secondsRemaining });
      }
    }
  
    handlePause() {
      if (this.state.paused) {
        this.INTERVALID = setInterval(this.handleInterval, 1000);
        this.setState({ paused: false });
      } else {
        clearInterval(this.INTERVALID);
        this.setState({ paused: true });
      }
    }
  
    handleReset() {
      clearInterval(this.INTERVALID);
      this.setState({
        break: 5,
        session: 25,
        duringSession: true,
        secondsRemaining: 25 * 60,
        paused: true
      });
      this.beep = document.getElementById("beep");
      this.beep.pause();
      this.beep.load();
    }
  
    // + Functions
  
    startBreak() {
      this.setState({
        duringSession: false,
        secondsRemaining: this.state.break * 60,
        paused: false
      });
      this.INTERVALID = setInterval(this.handleInterval, 1000);
    }
  
    startSession() {
      this.setState({
        duringSession: true,
        secondsRemaining: this.state.session * 60,
        paused: false
      });
      this.INTERVALID = setInterval(this.handleInterval, 1000);
    }
  
    playBeep() {
      this.beep = document.getElementById("beep");
      this.beep.play();
    }
  
    processSeconds(secondsRemaining) {
      let minutes = parseInt(secondsRemaining / 60);
      if (minutes <= 9) {
        minutes = "0" + minutes;
      }
      let seconds = secondsRemaining - minutes * 60;
      if (seconds <= 9) {
        seconds = "0" + seconds;
      }
      return minutes + ":" + seconds;
    }
  
    /*
      componentAudio(){
          this.beep = document.getElementById("beep");
      }
      */

    render() {
      // console.log(this.state);
      let statusString = this.state.duringSession ? "Session" : "Break";
      return (
        <div id="app">
          <div className="lengths">
            <TimeLengthControl
              type="break"
              length={this.state.break}
              handleDec={(isBreak) => this.handleDecrement(isBreak)}
              handleInc={(isBreak) => this.handleIncrement(isBreak)}
            />
            <TimeLengthControl
              type="session"
              length={this.state.session}
              handleDec={(isBreak) => this.handleDecrement(isBreak)}
              handleInc={(isBreak) => this.handleIncrement(isBreak)}
            />
          </div>
          <div className="timer-container card mx-auto">
            <div className="card-header shadow-sm mb-4 indigo white-text">
              <h2 id="timer-label">{statusString}</h2>
            </div>
            <div className="fw-bold fs-1">
              <p id="time-left">
                {this.processSeconds(this.state.secondsRemaining)}
              </p>
            </div>
            <div id="controls" className="mx-2">
              <button 
              id="start_stop" 
              onClick={this.handlePause} 
              className="waves-effect waves-light btn-large blue">
                <i className="material-icons left">play_circle_outline</i>
                <i className="material-icons right">pause_circle_outline</i>
                Start / Pause
              </button>
              <button 
              id="reset" 
              onClick={this.handleReset} 
              className="waves-effect waves-light btn-large black">
                <i className="material-icons right">undo</i>
                Reset
              </button>
            </div>
          </div>
          <audio
            id="beep"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          />
        <div className="title text-center fw-bold fs-1 py-5 white-text">25 + 5 Clock - by <a href="https://www.github.com/P3P3-49" target="_blank">@P3P3_49</a></div>
        </div>
      );
    }
  }
  
  ReactDOM.render(<App />, document.getElementById("root"));

}

export default App
