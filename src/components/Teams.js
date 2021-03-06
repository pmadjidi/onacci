
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
      let avatar = "/avatar/team/" + team + "/" + team  + ".png"
      return <li key={index} onClick={()=>this.props.action(team)}>
        <div className="tooltip">
        <img  className ="onlineImage"  data-tooltip="Current Team...." src={avatar} ref={img => this.img = img} onError={(e)=>{e.target.src='/images/onacci.png'}} />
          <span className="tooltiptext">Current selected team</span>
         {this.CL(team)}
         </div>
      </li>
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

/*
<div class="tooltip">Hover over me
  <span class="tooltiptext">Tooltip text</span>
</div>
*/
