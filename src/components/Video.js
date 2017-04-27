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
  let peerConnCfg = {'iceServers':
    [{'url': 'stun:stun.services.mozilla.com'},
     {'url': 'stun:stun.l.google.com:19302'}]
  };

class MyVideo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      online: [],
      auth: false,
      peerConn: null,
      remoteVideoSrc: null,
      localVideoSrc: null,
      targetUser: null,
      messageWindow: "",
      currentUser: null,
      currentSession: null
    }
  }

    sendOnline() {
      let sess = localStorage.getItem("currentSession")
      this.props.ws.send(JSON.stringify({type: "online",payload: {command: "list",session: sess}}))
    }

    componentWillMount() {
      let user = localStorage.getItem("currentUser")
      let sess = localStorage.getItem("currentSession")
      if (sess)
        this.setState({auth: true,currentUser: user,currentSession: sess})
      console.log(user,sess)
      console.log(this.props.ws)
      this.sendOnline()
      setInterval(this.sendOnline.bind(this),30*1000)
    }

    componentDidMount() {
      let that = this
      this.props.ws.addEventListener('message', function (event) {
    console.log('Message from server', event);
    let m = JSON.parse(event.data)
    if (m.type === "online")
      that.setState({online: m.data})
    }
)}

componentWillUnmount() {
  console.log("Video: removeEventListener....");
  this.props.ws.removeEventListener('message')
}

signal(onlineUser){
  console.log("Signaling.....",onlineUser)
  this.setState({messageWindow: "Signaling......."})
  let peerConn = new RTCPeerConnection(peerConnCfg)
   peerConn.onicecandidate = function (evt) {
     if (!evt || !evt.candidate) return;
     ringing.play();
     this.props.ws.send(JSON.stringify({candidate: evt.candidate, targetUser: onlineUser}));
   }.bind(this)

    // once remote stream arrives, show it in the remote video element
   peerConn.onaddstream = function(evt) {
    let that = this
    that.setState({remoteVideoSrc: URL.createObjectURL(evt.stream) })
   }

  //this.setState({peerConn,targetUser: onlineUser})

   navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
    let localVideoSrc = URL.createObjectURL(stream);
    peerConn.addStream(stream);
    //Creating offer
    peerConn.createOffer(function (offer) {
      var off = new RTCSessionDescription(offer);

      peerConn.setLocalDescription(new RTCSessionDescription(off),function() {
          this.props.ws.send(JSON.stringify({"sdp": off }));
        }.bind(this),
        function(error) { console.log(error);}
      );
    }.bind(this),
    function (error) { console.log(error);}
  );
this.setState({localVideoSrc})
}.bind(this), function(error) { console.log(error)
})

}


  createOnlineList(onlineUser,i) {
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
    <video className = "lVideo" id="localVideo" src={this.state.localVideoSrc}autoPlay muted poster="/images/onacci.png"></video>
  </div>
  <div className = "cButtons">
    <input  className ="button button3" id="resetButton" type="button"   disabled value="End Call"/>
</div>
<div className = "iWindow">
  <textarea className = "iWindow" id="statusWindow" rows="5" cols="50" value = {this.state.messageWindow}></textarea>
 </div>
 </div>
 )
}
}

export default MyVideo
