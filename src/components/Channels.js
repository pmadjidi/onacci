
import React, { Component } from 'react';
import { Redirect } from 'react-router'



class Channels extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
}


createChannel(channel,index) {
      return <li key={index} onClick={()=>this.props.action(channel)}><span className="channelHash">#</span> {" " + channel}</li>
  }

render() {
  return (
  <div>
  <ul className= "channelList">
  {this.props.channelList.map((channel,index)=>this.createChannel(channel,index))}
  </ul>
  </div>
)
}
}

export default Channels
