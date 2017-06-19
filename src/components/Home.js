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

/** browser dependent definition are aligned to one and the same standard name **/
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition
  || window.msSpeechRecognition || window.oSpeechRecognition;

  let ringing = new Audio('/sound/detringer.m4a');
  console.log(ringing)
  let peeronline = new Audio('/sound/peeronline.m4a');







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
      commState: "sun_with_face",
      toolbarMessage: "",
      emoj: "",
      togglePicker: "none",
      mode: {display: "none"},
      keyboard: {display: "none"},
      video: {display: "none"},
      callStatus: "none"
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
    this.setupVideoEvents()

  }


  onOpen(evt)
  {
  this.setState({commState: "sun_with_face",mode: "clear"})
  }

  onClose(evt)
  {
    this.setState({commState: "new_moon_with_face",mode: "transp"})
  }


  onError(evt)
  {
    this.setState({commState: "bomb",mode: "transp"})
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
  e.preventDefault();
  for (var x=0; x < e.dataTransfer.files.length; x++) {
    var fr = new FileReader();
    fr.fileName = e.dataTransfer.files[x].name

    fr.addEventListener("loadend",(evt)=> {
      console.log(fr.result)
      let payload = {type: "avatar", payload: {type: "user",name: fr.fileName, file: fr.result}}
      this.sendMessage(payload)
    })

     fr.readAsDataURL(e.dataTransfer.files[x])
  }
}

handleDropTeamAvatar(e) {
// prevent browser default behavior on drop
e.preventDefault();


for (var x=0; x < e.dataTransfer.files.length; x++) {
  var fr = new FileReader();
  fr.fileName = e.dataTransfer.files[x].name

  fr.addEventListener("loadend",(evt)=> {
    console.log(fr.result)
    let payload = {type: "avatar", payload: {type:"team" ,name: fr.fileName, file: fr.result}}
    this.sendMessage(payload)
  })

   fr.readAsDataURL(e.dataTransfer.files[x])
}
}

displayToolBarMessage(message){
  this.setState({toolbarMessage: message})
  setTimeout(()=> {
    this.setState({toolbarMessage: ""})}, 5000)
}


handleDrop(e) {
  console.log("CALLED.......");
  console.log(e.dataTransfer.files.length);
// prevent browser default behavior on drop
e.preventDefault();

let type = this.state.selected.type
let name = this.state.selected.name

// iterate over the files dragged on to the browser
for (var x=0; x < e.dataTransfer.files.length; x++) {
  // instantiate a new FileReader object
  this.sendAsset(e.dataTransfer.files[x].name,
    e.dataTransfer.files[x],name,type)
}
}


sendAsset(fileName,file,name,type) {
  let fr = new FileReader();
  fr.addEventListener("loadend",(evt)=> {
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
      case "signal":
      that.processSignal(m.payload)
      break
      default:
      console.log("Uknown message type:",m)
     }
  }

//**************************************************** video call*********************************************

  processSignal(payload) {  //reciver local
    console.log("signal payload:",payload)
    this.setState({targetUser: payload.sourceUser,callStatus: "called",commState: "calling"})
    if (payload.candidate) {
      let cand = new RTCIceCandidate(payload.candidate) // remote
      this.props.peerConn.addIceCandidate(cand).
      then(()=>{
        console.log("sucess addIceCandiate......")
      })
      .catch(err=>{
        console.log("Error addIceCandiate Failded:",err)

      })
      //this.setState({messageWindow: payload.sourceUser + " Det ringer, det ringer..."})
    } else if (payload.sdp) {
      this.setState({callStatus: "connected"}) // local
      this.displayToolBarMessage("Connected")
      console.log("SDP from payload is",payload.sdp);
        let sdp = new RTCSessionDescription(payload.sdp)
        console.log("sdp: ",sdp)
        this.props.peerConn.setRemoteDescription(sdp)
    } else {
      console.log("Uknown signaling type: ",payload)
    }
  }


  setupVideoEvents() {

  let that = this


  this.props.peerConn.onicecandidate = evt => {
    console.log("onicecandidate event",evt)
     if (!evt || !evt.candidate)
     return;
     ringing.play();
     console.log("iceevent: ",evt);
     this.props.ws.send(JSON.stringify({type: "signal", payload:
        {candidate: evt.candidate, targetUser: this.state.selected.name,sourceUser: this.props.username}}));
   }

  this.props.peerConn.onaddstream = evt => {
    console.log("Remote video called................",evt)
    let remoteVideoSrc = URL.createObjectURL(evt.stream)
    console.log("Remote Video Object: ",remoteVideoSrc)
    this.setState({remoteVideoSrc: remoteVideoSrc})
  }

  this.props.peerConn.ondatachannel = evt => {
    let receiveChannel = evt.channel;
    receiveChannel.onmessage = function(event){
      that.setState({chattWindow: event.data})
}
}

this.props.peerConn.oniceconnectionstatechange = evt => {
    if(this.props.peerConn.iceConnectionState == 'disconnected') {
        console.log('Disconnected');
        this.endCall()
    }
}

  let dataChannel = this.props.peerConn.createDataChannel(this.state.selected.name, {reliable: false})
  dataChannel.onerror = function (error) {
console.log("Data Channel Error:", error);
}


dataChannel.onmessage = function (event) {
  console.log("Got Data Channel Message:", event.data);
}

dataChannel.onopen = function () {
  dataChannel.send("Hello from ONACCI...");
}

dataChannel.onclose = function () {
  console.log("The Data Channel is Closed");
}

this.setState({dataChannel})

}

signal(){ //caller
  let onlineUser = this.state.selected.name
  this.setState({video: {display: "block"},callStatus: "calling",commState: "calling",messageWindow: "Ringing.......\n",targetUser: onlineUser})
  console.log("Signaling.....",onlineUser)


  //this.setState({peerConn,targetUser: onlineUser})

   navigator.getUserMedia({ "audio": true, "video": true }, stream => {
    let localVideoSrc = URL.createObjectURL(stream)
    this.props.peerConn.addStream(stream)
    //Creating offer
    this.props.peerConn.createOffer(offer => {
      let off = new RTCSessionDescription(offer);

      this.props.peerConn.setLocalDescription(off,() => {
          let message = JSON.stringify({type: "signal", payload: {sdp: off,targetUser: onlineUser }})
          this.props.ws.send(message)
        },
        error =>{ console.log("peerConn.setLocalDescription: ",error);}
      );
    },
    error => { console.log("peerConn.createOffer: ",error)}
  );
  console.log("Local Video Object:",localVideoSrc)
this.setState({localVideoSrc})
}, error => { console.log(" navigator.getUserMedia: ",error)
})

}

answerCall() {
  navigator.getUserMedia({ "audio": true, "video": true }, stream => {
    this.props.peerConn.addStream(stream);
    this.props.peerConn.createAnswer(
      answer => {
        let ans = new RTCSessionDescription(answer);
        this.props.peerConn.setLocalDescription(ans, () => {
            let answer= JSON.stringify({type: "signal", payload: {sdp: ans,targetUser:  this.state.selected.name}})
            console.log("answer: ",answer)
            this.props.ws.send(answer);
            this.setState({messageWindow: "Picking the call, conected...."})
          },
          error => { console.log(error);}
        );
      },
      error => {console.log(error);}
    )
    let localVideoSrc = URL.createObjectURL(stream);
    this.onlineAction({name: this.state.targetUser})
    this.setState({localVideoSrc: localVideoSrc,video: {display: "block"},callStatus: "connected"})
    this.displayToolBarMessage("Connected")
  }, error => { console.log(error) ;});
}


endCall() {
  console.log("signal state: ",this.props.peerConn.signalingState);
  //this.props.peerConn.close();
  /*
  if (this.state.localVideoSrc) {
    this.state.localVideoSrc.getTracks().forEach(function (track) {
      track.stop();
    });
  }
  */
  this.setState({video: {display: "none"},callStatus: "none",commState: "sun_with_face",messageWindow: "Call ended..." + this.state.selected.name})
}

sendP2PMessage(e) {
  if (e.keyCode == 13) {
  this.setState({chattWindow:  this.props.username + ": " +  this.state.chattWindow})
  }
  this.setState({chattWindow: e.target.value });
  console.log("chattWindow is: ",this.state.chattWindow);
   this.state.dataChannel.send(this.state.chattWindow)
}



//************************************************


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
      contentArray.forEach(message=>this.sendNotifyed(message))
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
      this.setState({input: e.target.value,keyboard: {display: "block"} });
      this.sendTyping()
  }

  checkforEnter(e) {
    if(e.key == 'Enter'){
    this.handelInput()
    this.setState({input: "",keyboard: {display: "none"}})
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
    this.setState({typing: null, keyboard: {display: "none"}})
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

handleCommmState(){

  switch (this.state.callStatus) {
    case "none":
    this.signal()
    break
    case "calling":
    this.displayToolBarMessage("Calling " + this.state.targetUser + ".....")
    this.endCall()
    break
    case "called":
    this.displayToolBarMessage("Answering " + this.state.targetUser + ".....")
    this.answerCall()
    break
    case "connected":
    this.endCall()
    break
    default:
      this.displayToolBarMessage("Onacci online.....")
    }
}

  render() {
    if (this.props.sess === "") {
        return <Redirect to= "/login" />
    }
    return (
      <div className={this.state.mode} >
      <div className = "wrapperHome fade-in.home">
      <div className = "HomeStatusBar">
      <div className= "HomeCurrentUser">
        <div className="HomeInfo">
          <img  className ="statusBarImage" src={"/avatar/user/" + this.props.team + "/" + this.props.username + ".png"} ref={img => this.img = img} onError={(e)=>{e.target.src='/images/onacci.png'}} />
          {this.CL(this.props.username)}
          <span style = {{marginLeft: "20%"}}>{this.CL(this.state.toolbarMessage)}</span>
          <div style = {{float: "right"}} onClick={this.handleCommmState.bind(this)}>
            <Emoji emoji={this.state.commState} size={64}/>
          </div>
        </div>
        </div>
       </div>
      <div className = "HomeTeam" onDrop = {this.handleDropTeamAvatar.bind(this)} >
        <Teams teamList = {[this.props.team]} action = {()=>{console.log("Clicked on team")}} onDrop = {this.handleDropTeamAvatar.bind(this)}  />
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
      <div className = "WorkBenchInfo">{this.CL(this.state.selected.type) + " "} {this.CL(this.state.selected.name)}
        <span style={{float: "right"}}><Emoji emoji={"iphone"} size={32} onClick={()=>this.signal()}/></span>
        </div>
      <Cards messages = {this.state.selected.contentArray} send={this.sendMessage.bind(this)} messageSelect={this.messageSelect.bind(this)} ></Cards>

      <div className = "VideoCall" style={this.state.video}>
        <div className="rVideo">
        <video className="rVideo" id="remoteVideo"  src={this.state.remoteVideoSrc} autoPlay poster="/images/onacci.png" ></video>
      </div>
      <div className = "lVideo" >
        <video className = "lVideo" id="localVideo" src={this.state.localVideoSrc} autoPlay muted poster="/images/onacci.png"></video>
      </div>
    <div className = "iWindow">
      <textarea className = "iWindow" id="statusWindow" rows="2" cols="100" value = {this.state.messageWindow}></textarea>
     </div>
     <div className = "cWindow">
       <textarea className = "cWindow" id="chattWindow"  autoFocus="autofocus" rows="9" cols="100" onChange= {this.sendP2PMessage.bind(this)} value ={this.state.chattWindow}></textarea>
      </div>
      </div>

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
      <div  style={{margin: "20px",padding: "20px",float: "left",display: this.state.keyboard}} >
      <Emoji emoji={"keyboard"} size={32} />
       </div>
       <Typing name={this.state.typing} />
       </div>
      </div>
    </div>
    )
  }
};

export default Home
