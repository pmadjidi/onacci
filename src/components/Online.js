import React, { Component } from 'react';
import { Redirect } from 'react-router'



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
        return <li key={index} className={onlineUser.status} onClick={()=>this.props.action(onlineUser)}>{this.CL(onlineUser.name)}</li>
  }



render() {
  console.log("userList: in Online Render(): ",this.props.userList)
  return (
  <div className="fade-in">
  <div className="HomeInfo">Team</div>
  <ul className= "onlineLis fade-in">
  {this.props.userList.map((onlineUser,index)=>this.createOnline(onlineUser,index))}
  </ul>
  </div>
)
}
}

export default Online
