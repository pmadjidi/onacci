import React, { Component } from 'react';
import Emojify from 'react-emojione';
import Links from './Links'
import Online from './Online'
import Channels from './Channels'
import Cards from './Cards'
import Teams from './Teams'




class Typing  extends React.Component{
    render() {
        if (this.props.name === null)
          return <div className="HomeInfo">.....</div>
        return (
            <div className = "HomeInfo">Typing: {this.props.name} ...</div>
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
    //console.log(this.props.ws)
    this.sendWhoAmI()
    this.sendOnline()
    this.sendChannels()
    this.channelAction({name: "General"})
  }

  sendWhoAmI() {
    let payload = {type: "whoAmI",payload: {}}
    this.sendMessage(payload)
  }

  sendOnline() {
    let payload = {type: "online",payload: {}}
    this.sendMessage(payload)
  }

  sendChannels() {
    let payload = {type: "channels",payload: {}}
    this.sendMessage(payload)
  }

  sendMessageUser() {
      let type = "P2P"
      let targetUser = this.state.selected.name
      let content = this.CL(this.state.input)
      let time = new Date().getTime()
      let payload = {type: "message", payload: {type,targetUser,content}}
      if (content)
        this.sendMessage(payload)
  }

  sendTypingUser() {
      let type = "typingUser"
      let targetUser = this.state.selected.name
      let time = new Date().getTime()
      let payload = {type: "message", payload: {type,targetUser}}
      this.sendMessage(payload)
  }

  sendTypingChannel() {
      let type = "typingChannel"
      let targetChannel = this.state.selected.name
      let time = new Date().getTime()
      let payload = {type: "message", payload: {type,targetChannel}}
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
    let targetChannel = this.state.selected.name
    let content = this.CL(this.state.input)
    let payload = {type: "message",payload: {type,targetChannel,content}}
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


    sendMessage(message){
      console.log("DDDD",message);
      message.payload.session = this.state.currentSession
      message.payload.sourceUser = this.state.currentUser
      console.log("sending message",message);
      this.props.ws.send(JSON.stringify(message))
    }




  handleDrop(e) {
  // prevent browser default behavior on drop
  e.preventDefault();

  // iterate over the files dragged on to the browser
  for (var x=0; x < e.dataTransfer.files.length; x++) {

    // instantiate a new FileReader object
    var fr = new FileReader();

    // loading files from the file system is an asynchronous
    // operation, run this function when the loading process
    // is complete
    fr.addEventListener("loadend",()=> {
      // send the file over web sockets
      this.props.ws.send(fr.result);
    });

    // load the file into an array buffer
    fr.readAsArrayBuffer(e.dataTransfer.files[x]);
  }
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
      case "newChannel":
      that.setState({channels: this.state.channels.push(m.data)})
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
    let replay = {type: "message",payload: {type: "replayCH", userName: aUser.name}}
    let contentArray = this.state.usersContent[aUser.name]
    if (!contentArray) {
      this.sendMessage(replay)
      this.setState({selected: {type: "user",name: aUser.name,contentArray: new Array()}})
      return
  }

      this.setState({selected: {type: "user",name: aUser.name,contentArray: contentArray}})
      console.log("A User selected...",this.state.selected)
      return
    }

  channelAction(channel) {
    let aChannel = channel.name
    let replay = {type: "message",payload: {type: "replayCH", channelName: aChannel}}
    let contentArray = this.state.channelsContent[aChannel]
    if (!contentArray) {
      this.sendMessage(replay)
      this.setState({selected: {type: "channel",name: aChannel,contentArray: new Array()}})
      return
    }

    this.setState({selected: {type: "channel",name: aChannel,contentArray: contentArray}})
    contentArray.forEach(message=>this.sendNotifyed(message))
    this.resetChannelNotification(aChannel)
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

  setChannelNotification(channelName) {
    let ar = this.state.channels.map(channel=> {
      if (channel.name === channelName) {
        channel.notify += 1
      }
      return channel
    })
    this.setState({channels: ar})
  }


    resetChannelNotification(channelName) {
      let ar = this.state.channels.map(channel=> {
        if (channel.name === channelName) {
          channel.notify = 0
        }
        return channel
      })
      this.setState({channels: ar})
    }


    setUserNotification(userName) {
      console.log("implement user notification");
    }

    sendNotifyed(message) {
      if (!message.notifyed) {
      let mess = {type: "seen",payload: {id: message.id}}
      console.log("DEBUGG",mess);
      this.sendMessage(mess)
      }
    }

  processChannelMessage(message) {
      let channelsContent
    if (this.state.channelsContent[message.targetChannel])
      this.state.channelsContent[message.targetChannel].push(message)
    else {
        this.state.channelsContent[message.targetChannel] = new Array()
        this.state.channelsContent[message.targetChannel].push(message)
  }
  if (this.state.selected.type === "channel" && this.state.selected.name === message.targetChannel) {
    let selected = {type: "channel",name: this.state.selected.name, contentArray: this.state.channelsContent[message.targetChannel]}
    this.sendNotifyed(message) // channel windo open
    this.setState({selected})
}
else {
  this.setChannelNotification(message.targetChannel)
}

  }

  processRecivedP2P(message) {
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
  } else {
  this.setUserNotification(message.targetUser)
  }
}

  processRecivedTypingUser(message) {
    if (this.state.selected.type === "user" && this.state.selected.name === message.sourceUser)
    this.setState({typing: message.sourceUser})
    setTimeout(this.clearType.bind(this), 7000)
  }

  processRecievedTypingChannel(message) {
    if (this.state.selected.type === "channel" && this.state.selected.name === message.targetChannel)
    this.setState({typing: message.sourceUser})
    setTimeout(this.clearType.bind(this), 7000)
  }

  processRecievedMessage(message){
    console.log("Recived Message",message)
    let type = message.type

      switch(type) {
        case "channel":
        this.processChannelMessage(message)
        break
        case "P2P":
        this.processRecivedP2P(message)
        break
        case "typingUser":
        this.processRecivedTypingUser(message)
        break
        case "typingChannel":
        this.processRecievedTypingChannel(message)
        break
        default:
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
      <div className = "wrapperHome fade-in.home" onDrop = {this.handleDrop.bind(this)}>
      <div className = "HomeStatusBar">
      <div className= "HomeCurrentUser">
        <div className="HomeInfo">{"Logged In @ " + this.CL(this.state.currentUser)}</div>
        </div>
        <Links />
       </div>
      <div className = "HomeTeam">
        <Teams teamList = {this.state.team} action = {()=>{console.log("Clicked on team")}} />
     </div>
     <div className = "HomeTools">
       <div className="HomeInfo">Tools</div>
    </div>
      <div className = "HomeOnline">
        <Online userList = {this.state.online} action={this.onlineAction.bind(this)}/>
     </div>
      <div className = "HomeChannels">
        <Channels channelList = {this.state.channels} action={this.channelAction.bind(this)} send={this.sendMessage.bind(this)}/>
        <div style={ {float:"left", clear: "both"} }
                ref={(el) => { this.messagesEnd = el; }}></div>
       </div>
      <div className = "HomeWorkBench"  ref={(div) => {this.messageList = div}}>
      <div className = "WorkBenchInfo">{this.CL(this.state.selected.type) + " "} {this.CL(this.state.selected.name)}</div>
      <Cards messages = {this.state.selected.contentArray} send={this.sendMessage.bind(this)} ></Cards>
      </div>
      <div className = "HomeAssets">
          <div className="HomeInfo">Assets
            <div>
            <p><span className = "HomeChannelPlus">+</span></p>
            </div>
            <Emojify style={{height: 32, width: 32}} onClick={e => alert(e.target.title)}>
              <span>Easy! :wink:</span>
              <span>😸 :D  ^__^</span>
            </Emojify>
            </div>
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
