import React, { Component } from 'react';
import { Redirect } from 'react-router'
import {Picker} from 'emoji-mart'
import {Emoji} from 'emoji-mart'
import Emojify from 'react-emojione';
import Links from './Links'
import Online from './Online'
import Channels from './Channels'
import Cards from './Cards'
import Teams from './Teams'
import Assets from './Assets'




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
      assets: [],
      online: [],
      channels: [],
      selected: {type: "",name: "",contentArray: [],assetArray: []},
      input: "",
      usersContent: {},
      channelsContent: {},
      typing: null,
      commState: true,
      emoj: "",
      togglePicker: "none",
      mode: {display: "none"}
    }
  }

  componentWillUnmount() {

  }

  componentDidMount() {
    let that = this
    this.props.ws.addEventListener('message',this.messageHandler.bind(this))
    this.props.ws.onopen = evt => { this.onOpen(evt) };
    this.props.ws.onclose = evt => { this.onClose(evt) };
    this.props.ws.onerror =  evt => { this.onError(evt) };
    //console.log(this.props.ws)
    console.log("PROPS FOR HOME",this.props);
  //  this.sendWhoAmI()
    this.sendOnline()
    this.sendChannels()
    this.channelAction({name: "General"})

  }


  onOpen(evt)
  {
  this.setState({commState: "true",mode: "clear"})
  }

  onClose(evt)
  {
    this.setState({commState: "false",mode: "transp"})
  }


  onError(evt)
  {
    this.setState({commState: "false",mode: "transp"})
    console.log("Socket Error: ", evt.data);
  }




/*
  sendWhoAmI() {
    let payload = {type: "whoAmI",payload: {}}
    this.sendMessage(payload)
  }
  */

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
      message.payload.session = this.props.sess
      message.payload.sourceUser = this.props.username
      message.payload.team = this.props.team
      console.log("sending message",message);
      try {
      this.props.ws.send(JSON.stringify(message))
    } catch (err) {
      console.log(err.code);
      console.log("retry in halfe a seconds");
      setTimeout((message) => {
      this.props.ws.send(JSON.stringify(message))
    }, 500,message)
    }
    }


  allowDrop(event){
        event.preventDefault();
      }

  handleDropAvatar(e) {
    console.log("CALLED.......");
    console.log(e.dataTransfer.files);
  // prevent browser default behavior on drop
  e.preventDefault();


  // iterate over the files dragged on to the browser
  for (var x=0; x < e.dataTransfer.files.length; x++) {
    // instantiate a new FileReader object
    var fr = new FileReader();
    fr.fileName = e.dataTransfer.files[x].name

    // loading files from the file system is an asynchronous
    // operation, run this function when the loading process
    // is complete
    fr.addEventListener("loadend",(evt)=> {
      console.log(fr.result)
      // send the file over web sockets
      //this.props.ws.binaryData = 'ArrayBuffer'

      let payload = {type: "avatar", payload: {name: fr.fileName, file: fr.result}}
      this.sendMessage(payload)
    })

    // load the file into an array buffer
    //fr.readAsArrayBuffer(e.dataTransfer.files[x]);
     fr.readAsDataURL(e.dataTransfer.files[x])
  }
}

handleDrop(e) {
  console.log("CALLED.......");
  console.log(e.dataTransfer.files.length);
// prevent browser default behavior on drop
e.preventDefault();


// iterate over the files dragged on to the browser
for (var x=0; x < e.dataTransfer.files.length; x++) {
  // instantiate a new FileReader object
  this.sendAsset(e.dataTransfer.files[x].name,
    e.dataTransfer.files[x])
}
}


sendAsset(fileName,file) {
  let fr = new FileReader();
  fr.addEventListener("loadend",(evt)=> {
    let type = this.state.selected.type
    let name = this.state.selected.name
    let payload
    if (type === "channel")
      payload = {type: "assets", payload: {name: fileName, file: fr.result, type: type, targetChannel: name}}
    else
      payload = {type: "assets", payload: {name: fileName, file: fr.result, type: type, targetUser: name}}

    this.sendMessage(payload)

  })

  fr.readAsDataURL(file)

}

  messageHandler(event) {
    let that = this
    console.log('Message from server', event);
    let m = JSON.parse(event.data)
    switch(m.type) {
      case "online":
      that.setState({online: m.data})
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
      case "assets":
      that.processAsset(m.payload)
      break
      default:
      console.log("Uknown message type:",m)
     }
  }


  processAsset(payload){
    //console.log("processAsset recieved: ",payload);
    this.setState({assets: payload})
  }

  componentWillUnmount() {
    console.log("Video unmounts........")
      this.props.ws.removeEventListener('message',this.messageHandler)
  }


  assetsAction(aAsset) {
    console.log("Asset selected:", aAsset);
  }

  onlineAction(aUser) {
    if (!aUser)
      return
    console.log("onlineAction",aUser);
    let replayUser = {type: "message",payload: {type: "replayP2P", userName: aUser.name}}
    let replayAssets = {type: "assets",payload: {type: "user", userName: aUser.name}}
    let contentArray = this.state.usersContent[aUser.name]
    let assetArray = this.state.assets[aUser.name]
    this.sendMessage(replayAssets)
    if (!contentArray) {
      let contentArray = this.state.usersContent[aUser.name] = new Array()
      this.sendMessage(replayUser)
      this.setState({selected: {type: "user",name: aUser.name,contentArray: contentArray}})
      return
  }

      this.setState({selected: {type: "user",name: aUser.name,contentArray: contentArray}})
      this.resetOnlineNotification(aUser)
      console.log("A User selected...",this.state.selected)
      return
    }

  channelAction(channel) {
    let aChannel = channel.name
    console.log("channel selected:  ", aChannel);
    let replayChannel = {type: "message",payload: {type: "replayCH", channelName: aChannel}}
    let replayAssets = {type: "assets",payload: {type: "channel", channelName: aChannel}}
    let contentArray = this.state.channelsContent[aChannel]
    this.sendMessage(replayAssets)
    if (!contentArray) {
      contentArray = this.state.channelsContent[aChannel] = new Array()
      this.setState({selected: {type: "channel",name: aChannel,contentArray: contentArray}})
      this.sendMessage(replayChannel)
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
        if (channel && channel.name === channelName) {
          channel.notify = 0
        }
        return channel
      })
      console.log("debug resetChannelNotification",ar);
      this.setState({channels: ar})
    }


    setUserNotification(user) {
      console.log("setUserNotification",user);
      let ar = this.state.online.map(aUser=> {
        if (aUser && aUser.name === user) {
          aUser.notify += 1
        }
        return  aUser
      })
      this.setState({online: ar})
    }

    resetOnlineNotification(user) {
      console.log("resetOnlineNotification",user);
      let ar = this.state.online
      .filter(aUser=>aUser !== null)
      .map(aUser=> {
        if (aUser.name === user.name) {
          aUser.notify = 0
        }
        return  aUser
      })
      this.setState({online: ar})
    }



    sendNotifyed(message) {
      if (!message.notifyed) {
      let mess = {type: "seen",payload: {id: message.id,type: message.type}}
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
    this.sendNotifyed(message) // channel window open
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
    if (sourceUser === this.props.username)
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
  this.sendNotifyed(message)
  this.setState({selected})
  } else {
  this.setUserNotification(user)
  }
}

  processRecivedTypingUser(message) {
    if (this.state.selected.type === "user" && this.state.selected.name === message.sourceUser) {
    this.setState({typing: message.sourceUser})
    console.log("processRecivedTypingUser",message);
  }
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
  if (this.props.username !== null)
    this.scrollToBottom();
}


messageSelect(messageId) {
  console.log("message selected:",messageId);
  this.setState({selectedMessage: messageId})
}



togglePicker() {
  if (this.state.togglePicker === "none")
    this.setState({togglePicker: "block"})
    else {
      this.setState({togglePicker: "none"})
    }
}

processEmoji(emoji) {
  console.log("REFS", this.refs);
  //this.refs.HomeInputField.getInputDOMNode().focus();
  this.setState({input: this.state.input + emoji.colons,togglePicker: "none" })
}

  render() {
    let connection
    if (this.state.commState)
      connection = <Emoji emoji={"arrows_clockwise"} size={16}/>
    else
      connection = <Emoji emoji={"x"} size={16}/>

    console.log(connection);

    if (this.props.sess === "") {
        return <Redirect to= "/login" />
    }
    return (
      <div ClassName={this.state.mode} >
      <div className = "wrapperHome fade-in.home">
      <div className = "HomeStatusBar">
      <div className= "HomeCurrentUser">
        <div className="HomeInfo">
          <img  src={"/avatar/" + this.props.team + "/" + this.props.username + ".png"} className ="statusBarImage" ref={img => this.img = img} onError={(e)=>{e.target.src='/images/onacci.png'}} />
          {this.CL(this.props.username)}
          <div style = {{float: "right"}}>{connection}</div>
        </div>
        </div>
        <Links />
       </div>
      <div className = "HomeTeam">
        <Teams teamList = {[this.props.team]} action = {()=>{console.log("Clicked on team")}} />
     </div>
     <div className = "HomeTools">
       <div className="HomeInfo">Tools</div>
    </div>
      <div className = "HomeOnline" onDragOver={this.allowDrop.bind(this)} onDrop = {this.handleDropAvatar.bind(this)}>
        <Online userList = {this.state.online} action={this.onlineAction.bind(this)} team={this.props.team} />
     </div>
      <div className = "HomeChannels">
        <Channels channelList = {this.state.channels} action={this.channelAction.bind(this)} send={this.sendMessage.bind(this)}/>
        <div style={ {float:"left", clear: "both"} }
                ref={(el) => { this.messagesEnd = el; }}></div>
       </div>
      <div className = "HomeWorkBench"  ref={(div) => {this.messageList = div}} onDragOver={this.allowDrop.bind(this)} onDrop = {this.handleDrop.bind(this)} >
      <div className = "WorkBenchInfo">{this.CL(this.state.selected.type) + " "} {this.CL(this.state.selected.name)}</div>
<Cards messages = {this.state.selected.contentArray} send={this.sendMessage.bind(this)} messageSelect={this.messageSelect.bind(this)} ></Cards>
      </div>
      <div className = "HomeAssets">

            <Assets assetList = {this.state.assets} action={this.assetsAction.bind(this)}/>

      </div>
      <div className = "HomeInput">
        <input className = "HomeInputField" type="text"
          placeholder={"message To: " + this.state.selected.name}
           value={this.state.input} onKeyPress={this.checkforEnter.bind(this)}
           onChange={this.processInput.bind(this)}
           ref="HomeInputField"/>
        <div onClick={()=>this.togglePicker.bind(this)}>
          <p><span className = "HomeChannelPlus" onClick={this.togglePicker.bind(this)}>&#9786;</span></p>
        </div>
        <div>
        <Picker style={{display: this.state.togglePicker,zIndex: 2, position: 'absolute', bottom: '10px', right: '40px' }}
      emojiSize={24}
      sheetSize={64}
      color='#39BFD4'
      perLine={9}
      skin={1}
      native={false}
      set='emojione'
      onClick={this.processEmoji.bind(this) }
  />
  </div>
      <div  style={{margin: "20px",padding: "20px",float: "left"}} >
      <Emoji emoji={"keyboard"} size={32} style={this.state.keyboard} />
       </div>
       <Typing name={this.state.typing} />
       </div>
      </div>
    </div>
    )
  }
};

export default Home
