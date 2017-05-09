import React from 'react';
import {BrowserRouter as Router,Route,NavLink} from 'react-router-dom'
//import loggo from './public/images/onacci.png';
import './App.css';
import Video from './components/Video'
import Login from './components/Login'


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



class  Home extends React.Component {
  render() {
    return (
      <div className = "wrapperHome">
      <div className = "HomeStatusBar"> StatusBar </div>
      <div className = "HomeTeam"> team </div>
      <div className = "HomeOnline">online </div>
      <div className = "HomeChannels">channels </div>
      <div className = "HomeWorkBench">workBench </div>
      <div className = "HomeInput"> Input </div>
      </div>
    )
  }
};



const myHome = () =>   <div><Links /><h1>Home</h1></div>


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

const Links = () => (
  <nav>
    <NavLink exact activeClassName="active" to="/">Login</NavLink>
    <NavLink strict activeClassName="active" to={{pathname: '/about'}}>About</NavLink>
    <NavLink strict activeClassName="active" to={{pathname: '/Home'}}>Home</NavLink>
    <NavLink strict activeClassName="active" to={{pathname: '/video'}}>Video</NavLink>
  </nav>
)

const App = () => (
<Router>
  <div>
  <Route default strict path="/" component={LoginWrapper}/>
  <Route exact path="/home" component={Home} />
  <Route strict path="/about" component={About}/>
  <Route strict path="/video" component={VideoWrapper}/>
  </div>
</Router>

)
export default App;
