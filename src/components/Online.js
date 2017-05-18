import React, { Component } from 'react';
import { Redirect } from 'react-router'



class Online extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
}


createOnline(onlineUser,index) {
      return <li key={index} onClick={()=>this.props.action(onlineUser)}>@{onlineUser}</li>
  }

render() {
  console.log("userList: in Online Render(): ",this.props.userList)
  return (
  <div>
  <ul className= "onlineList">
  {this.props.userList.map((onlineUser,index)=>this.createOnline(onlineUser,index))}
  </ul>
  </div>
)
}
}

export default Online
