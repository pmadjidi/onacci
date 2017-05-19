import React, { Component } from 'react';
import  ReactDOM  from 'react-dom'
import Links from './Links'
import Online from './Online'
import Channels from './Channels'
import Cards from './Cards'
import Teams from './Teams'


class Typing  extends React.Component{
    render() {
        if (this.props.name === null)
          return <div className="typing">...</div>
        return (
            <div className = "typing">Typing: {this.props.name} ....</div>
        )
    }
}

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
      channelsContent: {},
      typing: null
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
    this.channelAction("General")
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
      let type = "P2P"
      let sourceUser = this.state.currentUser
      let targetUser = this.state.selected.name
      let content = this.CL(this.state.input)
      let time = new Date().getTime()
      let payload = {type: "message", payload: {type,sourceUser,targetUser,content}}
      //this.setState({selected: {type: "user",name: targetUser,contentArray: this.state.selected.contentArray.push(payload)}})
      if (content)
        this.sendMessage(payload)
  }

  sendTypingUser() {
      let type = "typingUser"
      let sourceUser = this.state.currentUser
      let targetUser = this.state.selected.name
      let time = new Date().getTime()
      let payload = {type: "message", payload: {type,sourceUser,targetUser}}
      //this.setState({selected: {type: "user",name: targetUser,contentArray: this.state.selected.contentArray.push(payload)}})
      this.sendMessage(payload)
  }

  sendTypingChannel() {
      let type = "typingChannel"
      let sourceUser = this.state.currentUser
      let targetChannel = this.state.selected.name
      let time = new Date().getTime()
      let payload = {type: "message", payload: {type,sourceUser,targetChannel}}
      //this.setState({selected: {type: "user",name: targetUser,contentArray: this.state.selected.contentArray.push(payload)}})
      this.sendMessage(payload)
  }

sendTyping() {
  if (this.state.selected.type === "channel")
    this.sendTypingChannel()
  else {
    this.sendTypingUser()
  }
}

CL(string) {
    if (string)
      return string.charAt(0).toUpperCase() + string.slice(1);
    else {
        return string
    }
}



  sendMessageChannel() {
    let type = "channel"
    let sourceUser = this.state.currentUser
    let targetChannel = this.state.selected.name
    let content = this.CL(this.state.input)
    let payload = {type: "message",payload: {type,sourceUser,targetChannel,content}}
    if (content)
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
      payload.session = this.state.currentSession
      console.log("sending message",payload);
      this.props.ws.send(JSON.stringify(payload))
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
      this.state.team.push(m.payload.team)
      that.setState({currentUser: m.payload.username,currentSession: m.payload.session,currentTeam: m.payload.team})
      break
      case "channels":
      that.setState({channels: m.data})
      break
      case "message":
      that.processRecievedMessage(m.payload)
      break
      case "auth":
      console.log(m);
      break
      default:
      console.log("Uknown message type:",m)
     }
  }

  componentWillUnmount() {
    console.log("Video unmounts........")
      this.props.ws.removeEventListener('message',this.messageHandler)
  }


  onlineAction(aUser) {
    let replay = {type: "message",payload: {type: "replayCH", userName: aUser}}
    let contentArray = this.state.usersContent[aUser]
    if (!contentArray) {
      this.sendMessage(replay)
      this.setState({selected: {type: "user",name: aUser,contentArray: new Array()}})
      return
  }

      this.setState({selected: {type: "user",name: aUser,contentArray: contentArray}})
      console.log("A User selected...",this.state.selected)
      return
    }

  channelAction(aChannel) {
    let replay = {type: "message",payload: {type: "replayCH", channelName: aChannel}}
    let contentArray = this.state.channelsContent[aChannel]
    if (!contentArray) {
      this.sendMessage(replay)
      this.setState({selected: {type: "channel",name: aChannel,contentArray: new Array()}})
      return
    }

    this.setState({selected: {type: "channel",name: aChannel,contentArray: contentArray}})
    console.log("A Channel selected...",this.state.selected)
    return
  }

  processInput(e) {
      this.setState({input: e.target.value });
      this.sendTyping()
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
    let type = message.type
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
    else if (type === "P2P") {
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

      else if (type === "typingUser") {
        if (this.state.selected.type === "user" && this.state.selected.name === message.sourceUser)
        this.setState({typing: message.sourceUser})
        setTimeout(this.clearType.bind(this), 7000)
      }
      else if (type === "typingChannel") {
        if (this.state.selected.type === "channel" && this.state.selected.name === message.targetChannel)
        this.setState({typing: message.sourceUser})
        setTimeout(this.clearType.bind(this), 7000)
      }
      else {
        console.log("Error, unkown type, processRecievedMessage", type);
        console.log("DEBUG state....",this.state)
      }
  }

  clearType() {
    this.setState({typing: null})
  }

  scrollToBottom() {
  const scrollHeight = this.messageList.scrollHeight;
  const height = this.messageList.clientHeight;
  const maxScrollTop = scrollHeight - height;
  this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
}

componentDidUpdate() {
  if (this.state.currentUser !== null)
    this.scrollToBottom();
}

  render() {
    if (this.state.currentUser === null)
      return null
  //  console.log("render Home:",this.state)
    return (
      <div className = "wrapperHome">
      <div className = "HomeStatusBar">
      <div className= "HomeCurrentUser"> <h5>{"Logged In: " + this.CL(this.state.currentUser)} </h5></div>
        <Links />
       </div>
      <div className = "HomeTeam"> Teams:
        <Teams teamList = {this.state.team} action = {()=>{console.log("Clicked on team")}} />
     </div>
      <div className = "HomeOnline">Online:
        <Online userList = {this.state.online} action={this.onlineAction.bind(this)}/>
     </div>
      <div className = "HomeChannels">Channels:
        <Channels channelList = {this.state.channels} action={this.channelAction.bind(this)}/>
        <div style={ {float:"left", clear: "both"} }
                ref={(el) => { this.messagesEnd = el; }}></div>
       </div>
      <div className = "HomeWorkBench"  ref={(div) => {this.messageList = div}}>
      <div className = "typing">{this.CL(this.state.selected.type) + " "} {this.CL(this.state.selected.name)}</div>
      <Cards messages = {this.state.selected.contentArray} ></Cards>
      </div>
      <div className = "HomeInput">
        <input type="text" placeholder={"message To: " + this.state.selected.name}  value={this.state.input} onKeyPress={this.checkforEnter.bind(this)} onChange={this.processInput.bind(this)} />
       <Typing name={this.state.typing} />
       </div>
      </div>
    )
  }
};

export default Home
