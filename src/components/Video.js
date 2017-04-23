import React, { Component } from 'react';

/** browser dependent definition are aligned to one and the same standard name **/
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition
  || window.msSpeechRecognition || window.oSpeechRecognition;

  let ringing = new Audio('detringer.m4a');
  let peeronline = new Audio('peeronline.m4a');

class MyVideo extends React.Component {

    componentWillMount() {
      console.log(this.props.ws)
    }

  render() {
    return (
    <div className = "wrapper">
    <div className="rVideo">
    <video className="rVideo" id="remoteVideo" autoPlay poster="/images/onacci.png" ></video>
  </div>
  <div className = "lVideo" >
    <video className = "lVideo" id="localVideo" autoPlay muted poster="/images/onacci.png"></video>
  </div>
  <div className = "cButtons">
    <input className ="button button2" id="videoCallButton" type="button" disabled value="Video Call"/>
    <input  className ="button button3" id="resetButton" type="button"   disabled value="End Call"/>
</div>
<div className = "iWindow">
  <textarea className = "iWindow" id="statusWindow" rows="5" col = "50" > </textarea>
 </div>
 </div>
 )
}
}

export default MyVideo
