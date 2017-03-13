import React from 'react';
import ReactDOM from 'react-dom';
//import Dinner from './SecondLayer.jsx';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectChoice } from '../actions/index.jsx';

class FirstLayer extends React.Component {
  renderChoices () {
    return this.props.choices.firstLoad.map((choice) => {
      return (
        <img
          key={choice.img}
          onClick={() => this.props.selectChoice(choice.option)}
          src={choice.img} />
      );
    });
  }

  render() {
    return (
      <div className="col-sm-4">
      { this.renderChoices() }</div>
    );
  }
}

  function mapStateToProps(state) {
    return {
      choices: state.choices,
    };
  }

  function mapDispatchToProps(dispatch){
    return bindActionCreators({ selectChoice: selectChoice }, dispatch);
  }



export default connect(mapStateToProps, mapDispatchToProps)(FirstLayer);