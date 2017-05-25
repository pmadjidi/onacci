import React from 'react';
import {BrowserRouter as Router,Route,NavLink} from 'react-router-dom'
//import loggo from './public/images/onacci.png';
import './App.css';
import Video from './components/Video'
import Login from './components/Login'
import Home from './components/Home'
import Settings from './components/Settings'


let config = {
  //wssHost: 'wss://aka.ite.kth.se:9000/websocket/'
  wssHost: 'wss://aka.ite.kth.se:9000/websocket/'
};

let wsc = new WebSocket(config.wssHost)
console.log("Socket state: ", wsc.readyState)

let peerConnCfg = {'iceServers':
  [{'url': 'stun:stun.services.mozilla.com'},
   {'url': 'stun:stun.l.google.com:19302'}]
};

//let peerConn = new RTCPeerConnection(peerConnCfg)




class  VideoWrapper extends React.Component {
  render() {
    return (
        <Video ws={wsc} peerConn={new RTCPeerConnection(peerConnCfg)}/>
    );
  }
};

class  LoginWrapper extends React.Component {
  render() {
    return (
        <Login ws={wsc} />
    );
  }
};

class  HomeWrapper extends React.Component {
  render() {
    return (
        <Home ws={wsc} />
    );
  }
};


// const myHome = () =>   <div><Links /><h1>Home</h1></div>


function  createOnlineList(onlineUser,i) {
      return <li key={i} onClick={()=>this.signal(onlineUser)}>{onlineUser}</li>
  }

const Online = props => {return (
  <div>
  <ul>
  {this.props.userList.map((onlineUser,i)=>this.createOnlineList(onlineUser,i))}
  </ul>
  </div>
)
}

const About = () => <h1>About ONACCI</h1>

const App = () => (
<Router>
  <div>
  <Route default strict path="/" component={LoginWrapper}/>
  <Route exact path="/home" component={HomeWrapper} />
  <Route strict path="/about" component={About}/>
  <Route strict path="/video" component={VideoWrapper}/>
  <Route strict path="/settings" component={Settings}/>
  </div>
</Router>

)
export default App;
