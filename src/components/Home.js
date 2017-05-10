import React, { Component } from 'react';
import { Redirect } from 'react-router'

import Links from './Links'
import Online from './Online'
import Channels from './Channels'

class  Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      team: [],
      online: [],
      channels: [],
      inputText: "",
      targetUser: null,
      currentUser: null,
      currentSession: null
    }
  }

  componentWillUnmount() {

  }

  componentDidMount() {
    let that = this
    this.props.ws.addEventListener('message',this.messageHandler.bind(this))
    console.log(this.props.ws)
    this.sendWhoAmI()
    this.sendOnline()
  }

  sendWhoAmI() {
    this.props.ws.send(JSON.stringify({type: "whoAmI",payload: {},session: this.state.currentSession}))
  }

  sendOnline() {
    this.props.ws.send(JSON.stringify({type: "online",payload: {}, session: this.state.currentSession}))
  }

  sendChannels() {
    this.props.ws.send(JSON.stringify({type: "channels",payload: {}, session: this.state.currentSession}))
  }




  messageHandler(event) {
    let that = this
    console.log('Message from server', event);
    let m = JSON.parse(event.data)
    switch(m.type) {
      case "online":
      console.log("Got Online",m.data);
      that.setState({online: m.data})
      break
      case "whoAmIAns":
      that.setState({currentUser: m.payload.username,currentSession: m.payload.session})
      break
      case "channels":
      that.setState({channels: m.data})
      break
      default:
      console.log("Uknown message type:",m.type)
     }
  }

  componentWillUnmount() {
    console.log("Video unmounts........")
      this.props.ws.removeEventListener('message',this.messageHandler)
  }

  onlineAction() {
    console.log("test Online")
  }

  channelAction() {
    console.log("test Channel")
  }

  render() {
    console.log("render online:",this.state.online)
    return (
      <div className = "wrapperHome">
      <div className = "HomeStatusBar"> <Links /> </div>
      <div className = "HomeTeam"> Teams: </div>
      <div className = "HomeOnline">Online:
        <Online userList = {this.state.online} action={this.onlineAction.bind(this)}/>
     </div>
      <div className = "HomeChannels">Channels:
        <Channels channelList = {this.state.channels} action={this.channelAction.bind(this)}/>
       </div>
      <div className = "HomeWorkBench">workBench </div>
      <div className = "HomeInput"> Input: </div>
      </div>
    )
  }
};

export default Home
