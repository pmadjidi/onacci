import React, { Component } from 'react';
import  ReactDOM  from 'react-dom'
import Links from './Links'
import Online from './Online'
import Channels from './Channels'
import Cards from './Cards'



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
      selected: {type: "",name: "",contentArray: []},
      input: "",
      usersContent: {},
      channelsContent: {}
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
    let payload = {type: "whoAmI",payload: {},session: this.state.currentSession}
    this.sendMessage(payload)
  }

  sendOnline() {
    let payload = {type: "online",payload: {}, session: this.state.currentSession}
    this.sendMessage(payload)
  }

  sendChannels() {
    let payload = {type: "channels",payload: {}, session: this.state.currentSession}
    this.sendMessage(payload)
  }

  sendMessageUser() {
      let messageT = "P2P"
      let sourceUser = this.state.currentUser
      let targetUser = this.state.selected.name
      let content = this.state.input
      let time = new Date().getTime()
      let payload = {messageT,sourceUser,targetUser,content}
      //this.setState({selected: {type: "user",name: targetUser,contentArray: this.state.selected.contentArray.push(payload)}})
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
    let contentArray = this.state.usersContent[aUser]
    if (!contentArray)
      contentArray = []
      let payload = {type: "replay",payload: {type: "P2P", userName: aUser}}
      this.sendMessage(payload)
    this.setState({selected: {type: "user",name: aUser,contentArray: contentArray}})
    console.log("test Online selected: ",this.state.selected)
  }

  channelAction(aChannel) {

    let contentArray = this.state.channelsContent[aChannel]
    if (!contentArray) {
      contentArray = []
      let payload = {type: "replay",payload: {type: "channel", channelName: aChannel}}
      this.sendMessage(payload)
    this.setState({selected: {type: "channel",name: aChannel,contentArray: contentArray}})
    console.log("test Channel selected: ",this.state.selected)
    }
  }

  processInput(e) {
      this.setState({input: e.target.value });
  }

  checkforEnter(e) {
    if(e.key == 'Enter'){
    this.handelInput()
    this.setState({input: ""})
  }
  }

  processRecievedMessage(message){
    console.log("Recived Message",message)
    let channelsContent
    let type = message.messageT
      if (type === "channel") {
        if (this.state.channelsContent[message.targetChannel])
          this.state.channelsContent[message.targetChannel].push(message)
        else {
            this.state.channelsContent[message.targetChannel] = new Array()
            this.state.channelsContent[message.targetChannel].push(message)
      }
      if (this.state.selected.type === "channel" && this.state.selected.name === message.targetChannel) {
        let selected = {type: "channel",name: this.state.selected.name, contentArray: this.state.channelsContent[message.targetChannel]}
        this.setState({selected})
    }
  }
    else {
      let sourceUser = message.sourceUser
      let targetUser = message.targetUser
      let user = null
      if (sourceUser === this.state.currentUser)
        user = targetUser
      else {
        user = sourceUser
      }
      if (this.state.usersContent[user])
      this.state.usersContent[user].push(message)
      else {
        this.state.usersContent[user] = new Array()
        this.state.usersContent[user].push(message)
    }
    if (this.state.selected.type === "user" && this.state.selected.name === user) {
    let selected = {type: "user",name: user, contentArray: this.state.usersContent[user]}
    this.setState({selected})
  }
      }
      console.log("DEBUG",this.state)
  }

  scrollToBottom() {
  const scrollHeight = this.messageList.scrollHeight;
  const height = this.messageList.clientHeight;
  const maxScrollTop = scrollHeight - height;
  this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
}

componentDidUpdate() {
  this.scrollToBottom();
}

  render() {
    if (this.state.currentUser === null)
      return null
  //  console.log("render Home:",this.state)
    return (
      <div className = "wrapperHome">
      <div className = "HomeStatusBar">
      <div className= "HomeCurrentUser"> <h5>{"Logged In: " + this.state.currentUser} </h5></div>
        <Links />
       </div>
      <div className = "HomeTeam"> Teams: </div>
      <div className = "HomeOnline">Online:
        <Online userList = {this.state.online} action={this.onlineAction.bind(this)}/>
     </div>
      <div className = "HomeChannels">Channels:
        <Channels channelList = {this.state.channels} action={this.channelAction.bind(this)}/>
        <div style={ {float:"left", clear: "both"} }
                ref={(el) => { this.messagesEnd = el; }}></div>
       </div>
      <div className = "HomeWorkBench"  ref={(div) => {this.messageList = div}}>
      workBench: {this.state.selected.name}
      <Cards messages = {this.state.selected.contentArray} ></Cards>
      </div>
      <div className = "HomeInput">
        <input type="text" placeholder={"message To: " + this.state.selected.name}  value={this.state.input} onKeyPress={this.checkforEnter.bind(this)} onChange={this.processInput.bind(this)} />
       </div>
      </div>
    )
  }
};

export default Home
