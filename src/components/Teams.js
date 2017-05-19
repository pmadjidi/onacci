
import React, { Component } from 'react';
import { Redirect } from 'react-router'



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
      return <li key={index} onClick={()=>this.props.action(team)}><span className="teamStar">*</span> {" " + this.CL(team)}</li>
  }

render() {
  return (
  <div>
  <ul className= "teamList">
  {this.props.teamList.map((team,index)=>this.createChannel(team,index))}
  </ul>
  </div>
)
}
}

export default Teams
