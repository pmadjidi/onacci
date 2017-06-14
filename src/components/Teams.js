
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
      let avatar = "/avatar/team/" + message.team + "/" + message.sourceUser + ".png"
      return <li key={index} onClick={()=>this.props.action(team)}>
        <img src={avatar} alt="Avatar" className ="w3-left  w3-margin-right w3-img" ref={img => this.img = img} onError={(e)=>{e.target.src='/images/onacci.png'}} />
        {this.CL(team)}</li>
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
