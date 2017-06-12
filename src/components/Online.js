import React, { Component } from 'react';
import { Redirect } from 'react-router'
import {Emoji} from 'emoji-mart'


class Online extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
}

CL(string) {
    if (string)
      return string.charAt(0).toUpperCase() + string.slice(1);
    else {
        return string
    }
}


createOnline(onlineUser,index) {
      if (onlineUser)
        return <li key={index} className={onlineUser.status + " onlineLi"}  onClick={()=>this.props.action(onlineUser)}>
          <img src={avatar} alt="Avatar" className ="w3-left  w3-margin-right w3-img" ref={img => this.img = img} onError={(e)=>{e.target.src='/images/onacci.png'}}/>
          {" " + this.CL(onlineUser.name)}<span id={index} className="HomeInfo">{onlineUser.notify > 0 ? onlineUser.notify:null}</span></li>
  }



render() {
  return (
  <div className="fade-in">
  <div className="HomeInfo">People</div>
  <ul className= "onlineList fade-in">
  {this.props.userList.map((onlineUser,index)=>this.createOnline(onlineUser,index))}
  </ul>
  </div>
)
}
}

export default Online
