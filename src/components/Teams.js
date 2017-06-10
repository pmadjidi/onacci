
import React, { Component } from 'react';
import { Redirect } from 'react-router'
import {Emoji} from 'emoji-mart'


class Teams extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
}

CL(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

createChannel(team,index) {
      return <li key={index} onClick={()=>this.props.action(team)}> <Emoji emoji={"busts_in_silhouette"} size={16}/>{" " + this.CL(team)}</li>
  }

render() {
  return (
  <div>
  <div className="HomeInfo">Teams</div>
  <ul className= "teamList">
  {this.props.teamList.map((team,index)=>this.createChannel(team,index))}
  </ul>
  </div>
)
}
}

export default Teams
