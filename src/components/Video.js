import React, { Component } from 'react';
import { Redirect } from 'react-router'

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



class MyVideo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      online: [],
      auth: true,
      remoteVideoSrc: null,
      localVideoSrc: null,
      targetUser: null,
      messageWindow: "",
      chattWindow: "",
      currentUser: null,
      currentSession: null,
      answer: "disabled",
      end: "disabled",
      dataChannel: null
    }
  }



    sendOnline() {
      this.props.ws.send(JSON.stringify({type: "online",payload: {}, session: this.state.currentSession}))
    }

    sendWhoAmI() {
      this.props.ws.send(JSON.stringify({type: "whoAmI",payload: {},session: this.state.currentSession}))
    }

    messageHandler(event) {
      let that = this
      console.log('Message from server', event);
      let m = JSON.parse(event.data)
      switch(m.type) {
        case "online":
        that.setState({online: m.data})
        break
        case "signal":
          console.log("signal payload:",m.payload)
          this.setState({targetUser: m.payload.sourceUser})
          if (m.payload.candidate) {
            let cand = new RTCIceCandidate(m.payload.candidate)
            console.log("cand: ",cand)
            that.props.peerConn.addIceCandidate(cand).
            then(()=>console.log("sucess addIceCandiate......"))
            .catch(err=>console.log("Error addIceCandiate Failded:",err))
            that.setState({messageWindow: m.payload.sourceUser + " Det ringer, det ringer..."})
          } else if (m.payload.sdp) {
              let sdp = new RTCSessionDescription(m.payload.sdp)
              console.log("sdp: ",sdp)
              that.props.peerConn.setRemoteDescription(sdp)
          } else {
            console.log("Uknown signaling type: ",m.payload)
          }
         break
         case "whoAmIAns":
          that.setState({currentUser: m.payload.username,currentSession: m.payload.session})
         break
         default:
         console.log("Uknown message type:",m.type)
       }

    }

      componentDidMount() {

      let that = this

      this.props.ws.addEventListener('message',this.messageHandler.bind(this))
      console.log(this.props.ws)
      this.sendOnline()
      this.sendWhoAmI()
      //setInterval(this.sendOnline.bind(this),10*1000)

      this.props.peerConn.onicecandidate = evt => {
        console.log("onicecandidate event",evt)
         if (!evt || !evt.candidate)
         return;
         ringing.play();
         this.props.ws.send(JSON.stringify({type: "signal", payload:
            {candidate: evt.candidate, targetUser: this.state.targetUser,sourceUser: this.state.currentUser}}));
       }

      this.props.peerConn.onaddstream = evt => {
        console.log("Remote video called................",evt)
        let remoteVideoSrc = URL.createObjectURL(evt.stream)
        console.log("Remote Video Object: ",remoteVideoSrc)
        that.setState({remoteVideoSrc})
      }

      this.props.peerConn.ondatachannel = function(event) {
        let receiveChannel = event.channel;
        receiveChannel.onmessage = function(event){
          that.setState({chattWindow: event.data})
  }
  }

      let dataChannel = this.props.peerConn.createDataChannel(this.state.targetUser, {reliable: false})
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

componentWillUnmount() {
  console.log("Video unmounts........")
    this.props.ws.removeEventListener('message',this.messageHandler)

}

signal(onlineUser){
  console.log("Signaling.....",onlineUser)
  this.setState({messageWindow: "Ringing.......\n"})
  this.setState({targetUser: onlineUser})

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
            let answer= JSON.stringify({type: "signal", payload: {sdp: ans,targetUser:  this.state.targetUser}})
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
    this.setState({localVideoSrc})
  }, error => { console.log(error) ;});
}


endCall() {
  this.setState({messageWindow: "Call ended..." + this.state.targetUser})
  this.props.peerConn.close();
  history.go(1);
  if (this.state.localVideoSrc) {
    this.state.localVideoSrc.getTracks().forEach(function (track) {
      track.stop();
    });
  }
}

sendMessage(e) {
  if (e.keyCode == 13)
   {
     console.log("this is enter")
     this.state.dataChannel.send(e.data)
   }
   else {
     this.setState({chattWindow: e.data})
   console.log("this is key= ", e.keyCode)
  }
}

// dataChannel = yourConn.createDataChannel("channel1", {reliable:true});


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
    <div className="rVideo">
    <video className="rVideo" id="remoteVideo"  src={this.state.remoteVideoSrc} autoPlay poster="/images/onacci.png" ></video>
  </div>
  <div className = "lVideo" >
    <video className = "lVideo" id="localVideo" src={this.state.localVideoSrc} autoPlay muted poster="/images/onacci.png"></video>
  </div>
  <div className = "cButtons">
  <input className ="button button1" id="answer" type="button" onClick={this.answerCall.bind(this)} value="Answer"/>
  <input  className ="button button2" id="end" type="button" onClick={this.endCall.bind(this)} value="End"/>
</div>
<div className = "iWindow">
  <textarea className = "iWindow" id="statusWindow" rows="2" cols="100" value = {this.state.messageWindow}></textarea>
 </div>
 <div className = "cWindow">
   <textarea className = "cWindow" id="chattWindow" rows="9" cols="100" onKeyUp= {this.sendMessage.bind(this)} value ={this.state.chattWindow}></textarea>
  </div>
 </div>
 )
}
}

export default MyVideo
