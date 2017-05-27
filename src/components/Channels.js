
import React, { Component } from 'react';
import { Redirect } from 'react-router'



class Channels extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      input: "",
      inputPurpuse: "",
      inputInvite: "",
      toggleInput: "none"
    }
}

channelPermission() {
  console.log("Clicked on plus");
}

createChannel(channel,index) {
    //console.log("DEBUG",channel);
      return (
      <li className="channelLi" key={index} onClick={()=>this.props.action(channel)}>
        <span className="channelHash">#</span>{this.CL(channel.name)}<span id={index} className="HomeInfo">{channel.notify > 0 ? channel.notify:null}</span></li>
        )
  }

checkforEnter(e) {
  if(e.key == 'Enter'){
    if (this.state.input !== "")
      this.props.send({type: "createchannel", payload:{channelname: this.state.input,
        purpuse: this.state.inputPurpuse,invite: this.state.inputInvite}})
  this.setState({toggleInput: "none",input: ""})
}
}

CL(string) {
    if (string)
      return string.charAt(0).toUpperCase() + string.slice(1);
    else {
        return string
    }
}



processInput(e) {
    this.setState({input: e.target.value });
}

processInputPurpuse(e) {
    this.setState({inputPurpuse: e.target.value });
}

processInputInvite(e) {
    this.setState({inputInvite: e.target.value });
}


toggleInput() {
  if (this.state.toggleInput === "none")
    this.setState({toggleInput: "block"})
    else {
      this.setState({toggleInput: "none"})
    }
}

render() {

  console.log("called channel render");
  console.log("Props....",this.props.channelList)
  if (!this.props.channelList)
     return <div>Loading...</div>;
  return (
  <div className="fade-in">
    <div className="HomeInfo">Channels
      <div>
      <p><span className = "HomeChannelPlus" onClick={this.toggleInput.bind(this)}>+</span></p>
      </div>
      <div className = "ChannelInput" style={{display: this.state.toggleInput}}>
        <input type="text" placeholder={"Channel name... "}  value={this.state.input} onKeyPress={this.checkforEnter.bind(this)} onChange={this.processInput.bind(this)} />
        <input type="text" placeholder={"Purpuse... "}  value={this.state.inputPurpuse} onKeyPress={this.checkforEnter.bind(this)} onChange={this.processInputPurpuse.bind(this)} />
        <input type="text" placeholder={"Send Invite... "}  value={this.state.inputInvite} onKeyPress={this.checkforEnter.bind(this)} onChange={this.processInputInvite.bind(this)} />

       </div>
    </div>
  <ul className= "channelList">
  {this.props.channelList.map((channel,index)=>this.createChannel(channel,index))}
  </ul>
  </div>
)
}
}

export default Channels
