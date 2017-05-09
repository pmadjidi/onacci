import React, { Component } from 'react';
import { Redirect } from 'react-router'



class Online extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
}


createOnlineList(onlineUser,index) {
      return <li key={index} onClick={()=>this.props.action(onlineUser)}>{onlineUser}</li>
  }

render() {
  return (
  <div>
  <ul>
  {this.props.userList.map((onlineUser,index)=>this.createOnlineList(onlineUser,index))}
  </ul>
  </div>
)
}
}

export default Online
