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
      usersContent: {},
      channelsContent: {},
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
      that.processRecievedMessage(m.payload)
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

    this.setState({selected: {type: "user",name: aUser},workBenchContent: ""})
    console.log("test Online selected: ",this.state.selected)
    this.updateWorkBench()
  }

  channelAction(aChannel) {
    this.setState({selected: {type: "channel",name: aChannel},workBenchContent: ""})
    console.log("test Channel selected: ",this.state.selected)
    this.updateWorkBench()
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
    console.log("Recived Message",message)
    let type = message.messageT
      if (type === "channel") {
        if (this.state.channelsContent[message.targetChannel])
          this.state.channelsContent[message.targetChannel].push(message)
        else {
            this.state.channelsContent[message.targetChannel] = new Array()
            this.state.channelsContent[message.targetChannel].push(message)
      }
      if (this.state.selected.type === "channel" && this.state.selected.name === message.targetChannel)
        this.updateWorkBench()
    }
    else {
      if (this.state.usersContent[message.targetUser])
      this.state.usersContent[message.targetUser].push(message)
      else {
        this.state.usersContent[message.targetUser] = new Array()
        this.state.usersContent[message.targetUser].push(message)
    }
    if (this.state.selected.type === "user" && this.state.selected.name === message.targetUser)
      this.updateWorkBench()
      }
      console.log("DEBUG",this.state)
  }

  updateWorkBench() {
    console.log("Updating workbench......");
    let type =  this.state.selected.type
    let workArray
    let messages = ""
    this.setState({workBenchContent: ""})

    if ( type === "channel")
      workArray = this.state.channelsContent[this.state.selected.name]
    else {
        workArray = this.state.usersContent[this.state.selected.name]
    }
    if (workArray) {
         workArray.forEach(message=> messages = messages + message.sourceUser + ": " + message.content + "\n")
        this.setState({workBenchContent: messages})
    }
  }

  render() {
  //  console.log("render Home:",this.state)
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
