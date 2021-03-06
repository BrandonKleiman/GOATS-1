import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from '../actions/UserActions';

// connect to Redux store
@connect((store) => {
  return {
    userdata: store.userdata,
  };
})

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.renderPicInput = this.renderPicInput.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.changePic = this.changePic.bind(this);
  }
  
  //dispatch a function to accept pending request
  acceptRequest(reqid, user) {
    this.props.dispatch(UserActions.acceptRequest(reqid, user))
  }

  //dispatch a function the destroys pending request when X is clicked
  declineRequest(reqid, user) {
    this.props.dispatch(UserActions.declineRequest(reqid, user));
  }

  // update a user's profile pic
  changePic() {
    this.props.dispatch(UserActions.changePic(this.state.value, this.props.userdata.userID, this.props.userdata.username))
  }

  //sets state with contents of textbox
  handleChange(e) {
    this.setState({ value: e.target.value})
  }

  //render a textbox on the screen for user to update profile picture when Change is clicked
  renderPicInput() {
    this.setState({
      picInput: (<div>New image URL:<form onSubmit={() => this.changePic()}><input onChange={this.handleChange} type="text"></input></form></div>)
    })
  }

// allows user to choose rating
//rating is chosen by the select option below
//look @ controllers
  chooseRating(num) {
    var tmprating = num.target.value.split(",")
    this.props.dispatch(UserActions.chooseRating(tmprating[0], tmprating[1], this.props.userdata.username))
  }

//this will delete a single entry in the history section for profile
// called by the onclick below
//look @ controllers
  deletehistory(historyid){
    this.props.dispatch(UserActions.deletehistory(historyid, this.props.userdata.username))
  }

  // Display the last selected activity from Browse or Tree
  renderCurrent() {
    return(
    <div className="col-md-8 col-md-offset-2"><div style={{width:"200px",height:"200px",overflow:'hidden', 'textAlign':'center', marginLeft: '45px'}}><img height="200px" src={this.props.userdata.current.image}></img></div>
    <h4>{this.props.userdata.current.name}</h4><br /></div>
    )
  }

  render() {
    const divStyle = {
      width: '200px',
      height: '200px',
      overflow: 'hidden',
    };

//checks if there is a token in local store
// if yes, user will have access to profile
//if not, then they will be directed to login page
    if(!!localStorage.getItem("userToken") === false){
      window.location.href= "/login"
      return false;
    }else{
    const mappedInvites = this.props.userdata.invites.map((invite, idx) => {
      return(
        <tr key={idx}>
          <td>{invite.groupID}</td>
          <td>{invite.sentBy}</td>
          <td><a onClick={() => this.acceptRequest(invite.id, this.props.userdata.username)}><span className="glyphicon glyphicon-ok green"></span></a></td>
          <td><a onClick={() => this.declineRequest(invite.id, this.props.userdata.username)}><span className="glyphicon glyphicon-remove red"></span></a></td>
        </tr>
      )
    })

    // Create a table row for every item in user's history list
    const mappedHistory = this.props.userdata.history.map((historyitem, index) => {
      var tmpHistory = JSON.parse(historyitem.address);
      var cat = JSON.parse(historyitem.category)
      var tmpCategory = [];
      if (cat) {
      cat.forEach(function(element) {
        tmpCategory.push(element.title)
      })
      }
      tmpCategory = tmpCategory.join(', ');
      var fiveselected = (historyitem.rating === '5');
      var fourselected = (historyitem.rating === '4');
      var threeselected = (historyitem.rating === '3');
      var twoselected = (historyitem.rating === '2');
      var oneselected = (historyitem.rating === '1');
      var notsure = (historyitem.rating === 'notsure');
      return(
        <tr key={index}>
          <td><a href={historyitem.url}><div style={divStyle}><img height="125px" src={historyitem.image}></img></div></a></td>
          <td>{historyitem.name}</td>
          <td>{tmpHistory.display_address[0]}<br />{tmpHistory.display_address[1]}</td>
          <td>{historyitem.phone}</td>
          <td>{tmpCategory}</td>
          <td><select onChange={this.chooseRating.bind(this)}>
            <option value="notsure"> </option>
            {notsure ? (<option selected="selected" value={['notsure', historyitem.id]}>5 - the best!</option>) : (<option value={['notsure', historyitem.id]}>Not Sure</option>)}
            {fiveselected ? (<option selected="selected" value={['5', historyitem.id]}>5 - the best!</option>) : (<option value={['5', historyitem.id]}>5 - the best!</option>)}
            {fourselected ? (<option selected="selected" value={['4', historyitem.id]}>4</option>) : (<option value={['4', historyitem.id]}>4</option>)}
            {threeselected ? (<option selected="selected" value={['3', historyitem.id]}>3</option>) : (<option value={['3', historyitem.id]}>3</option>)}
            {twoselected ? (<option selected="selected" value={['2', historyitem.id]}>2</option>) : (<option value={['2', historyitem.id]}>2</option>)}
            {oneselected ? (<option selected="selected" value={['1', historyitem.id]}>1 - Do not come here</option>) : (<option value={['1', historyitem.id]}>1 - Do not come here</option>)}
            </select><h1 className="headings">{historyitem.rating}</h1></td>
            <td><a onClick={() => this.deletehistory(historyitem.id)}><span className="glyphicon glyphicon-remove red"></span></a></td>
        </tr>
      )
    })
    return (
      <div className="profilecenter" style={{textAlign: 'center'}}>
      <div className="col-md-10 col-md-offset-1 whitee">
        <div className="row"><div className="col-md-6 col-md-offset-3"><h4>{this.props.userdata.username}<small> | Profile</small></h4></div><div className="centerthis col-md-2"><br /><div style={{width:"80px",height:"80px",overflow:'hidden', 'textAlign':'center'}}>
          <img style={{display:'block','textAlign':'center', margin:'auto'}}height="80px" src={this.props.userdata.userImg}></img></div>
        <a onClick={() => this.renderPicInput()}><small>Change</small></a><br />{this.state.picInput}</div></div>
         <div className="row">
          <div className="col-md-5 profilecenter"><br />
          <h3 className="headings">Current GOATS Pick</h3>
          {this.props.userdata.current !== undefined ? (this.renderCurrent()) : <div></div>}
          </div>
         <div className="whitee col-md-7"><h3 className="headings">Pending group invites</h3>
         <table className="table">
           <thead>
           <tr>
             <th>Invited to group:</th>
             <th>Invited by: </th>
             <th>Accept: </th>
             <th>Decline: </th>
           </tr>
           </thead>
           <tbody>
           {mappedInvites}
           </tbody>
           </table>
         </div>
        </div>
        <div className="row">
          <br />  <br />
         <h3 className="headings">My history</h3>
                  <table className="table">
           <thead>
           <tr>
             <th></th>
             <th>Name: </th>
             <th>Address: </th>
             <th>Phone: </th>
             <th>Category: </th>
             <th>My Rating: </th>
           </tr>
           </thead>
           <tbody>
           {mappedHistory}
           </tbody>
           </table>
          </div>
      </div>
      </div>
    );
  }
  }
}
