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
      currentTeam: "",
      currentUser: null,
      currentSession: null,
      selected: {type: "channel",name: "General"},
      input: "",
      messages: {},
      workBenchContent: ""
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
    this.sendChannels()
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

  sendMessageUser() {
      let messageT = "P2P"
      let sourceUser = this.state.currentUser
      let targetUser = this.state.selected.name
      let content = this.state.input
      let payload = {messageT,sourceUser,targetUser,content}
      this.sendMessage(payload)
  }


  sendMessageChannel() {
    let messageT = "channel"
    let sourceUser = this.state.currentUser
    let targetChannel = this.state.selected.name
    let content = this.state.input
    let payload = {messageT,sourceUser,targetChannel,content}
    this.sendMessage(payload)
  }

  handelInput() {
    console.log("in handle input");
    if (this.state.selected.type === "user"){
      this.sendMessageUser()
    }
    else {
      this.sendMessageChannel()
    }
  }


    sendMessage(payload){
      let type = "message"
      let session =  this.state.currentSession
      console.log("sending message",payload);
      this.props.ws.send(JSON.stringify({type,payload}))
    }


  messageHandler(event) {
    let that = this
    console.log('Message from server', event);
    let m = JSON.parse(event.data)
    switch(m.type) {
      case "online":
      that.setState({online: m.data})
      break
      case "whoAmIAns":
      that.setState({currentUser: m.payload.username,currentSession: m.payload.session,currentTeam: m.payload.team})
      break
      case "channels":
      that.setState({channels: m.data})
      break
      case "message":
      that.processRecievedMessage(m.data)
      break
      default:
      console.log("Uknown message type:",m.type)
     }
  }

  componentWillUnmount() {
    console.log("Video unmounts........")
      this.props.ws.removeEventListener('message',this.messageHandler)
  }

  onlineAction(aUser) {
    this.setState({selected: {type: "user",name: aUser}})
    console.log("test Online selected: ",this.state.selected)
  }

  channelAction(aChannel) {
    this.setState({selected: {type: "channel",name: aChannel}})
    console.log("test Channel selected: ",this.state.selected)
  }

  processInput(e) {
      this.setState({input: e.target.value });
  }

  checkforEnter(e) {
    if(e.key == 'Enter'){
    this.handelInput()
    this.setState({workBenchContent: this.state.workBenchContent + "\n" + this.state.input})
    this.setState({input: ""})
  }
  }

  processRecievedMessage(message){
    console.log(message)
  }

  render() {
    console.log("render Home:",this.state)
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
      <div className = "HomeWorkBench">workBench: {this.state.selected.name}
      <div> {this.state.workBenchContent} </div>
      </div>
      <div className = "HomeInput">
        <input type="text" placeholder={"message To: " + this.state.selected.name}  value={this.state.input} onKeyPress={this.checkforEnter.bind(this)} onChange={this.processInput.bind(this)} />
       </div>
      </div>
    )
  }
};

export default Home
