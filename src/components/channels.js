
import React, { Component } from 'react';
import { Redirect } from 'react-router'


class MyChannels extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      channels: []}
    }

    createOnlineList(onlineUser,i) {
      if (onlineUser !== this.state.currentUser)
        return <li key={i} onClick={()=>this.signal(onlineUser)}>{onlineUser}</li>
    }


render() {

  if (this.state.auth === false)
    return <Redirect to= "/login" />

  return (
  <div className = "wrapper">
  <div className = "online">
  <ul>
  {this.state.online.map((onlineUser,i)=>this.createOnlineList(onlineUser,i))}
  </ul>
  </div>
</div>
}
}
