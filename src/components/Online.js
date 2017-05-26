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
        return <li key={index} onClick={()=>this.props.action(onlineUser)}><span className={onlineUser.status}>@</span>{this.CL(onlineUser.name)}</li>
  }



render() {
  console.log("userList: in Online Render(): ",this.props.userList)
  return (
  <div>
  <div className="HomeInfo">Online</div>
  <ul className= "onlineList">
  {this.props.userList.map((onlineUser,index)=>this.createOnline(onlineUser,index))}
  </ul>
  </div>
)
}
}

export default Online
