import React, { Component } from 'react';
import { Redirect } from 'react-router'
import {Emoji} from 'emoji-mart'
import {emojify} from 'react-emojione';

const options = {
    convertShortnames: true,
    convertUnicode: true,
    convertAscii: true,
    styles: {
        backgroundImage: 'url(emojione.sprites.png)',
        width: '16px',
        height: '16px',
        margin: '4px'
    },
    // this click handler will be set on every emoji
    handleClick: event => alert(event.target.title)
};


class Assets extends React.Component {

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

/*
<a href="/images/myw3schoolsimage.jpg" download>
  <img border="0" src="/images/myw3schoolsimage.jpg" alt="W3Schools" width="104" height="142">
</a>

*/

createAsset(asset,index) {
    //console.log("DEBUG",channel);
    let contentSymbol
    let fileExt = asset.name.split('.').pop().toUpperCase();
    let path = "/assets/" + asset.team + "/" + asset.file

    switch (fileExt) {
    case "GIF":
    case "TIF":
    case "SVG":
    case "BMP":
    case "PNG":
    case "JPG":
    contentSymbol = "camera"
    break
    case "MP3":
    contentSymbol = ":musical_note:"

    break
    case "PDF":
    contentSymbol = 0x128462
    break
    default:
    contentSymbol = "bomb"
      console.log("Unknown media file.....",fileExt);
  }

      return (
    //  <li className="assetLi" key={index} onClick={()=>this.props.action(asset)}>{asset.name}</li>
      <div>
      <span onClick={console.log("test")}> {emojify(":musical_note:",options)} </span><span key={index} onClick={()=>this.props.action(asset)}>{index}<a className ="assetLink" href={path} download={asset.name}>{asset.name}</a></span>
     </div>
        )
  }

checkforEnter(e) {
  if(e.key == 'Enter'){
    if (this.state.input !== "")
      this.props.send({type: "createAsset", payload:{name: this.state.input,
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

  if (!this.props.assetList)
     return <div>Loading...</div>;
  return (
  <div className="fade-in">
    <div className="HomeInfo">Assets
      <div>
      <p><span className = "HomeChannelPlus" onClick={this.toggleInput.bind(this)}>+</span></p>
      </div>
      <div className = "ChannelInput" style={{display: this.state.toggleInput}}>
        <input type="text" placeholder={"Asset name... "}  value={this.state.input} onKeyPress={this.checkforEnter.bind(this)} onChange={this.processInput.bind(this)} />
        <input type="text" placeholder={"Purpuse... "}  value={this.state.inputPurpuse} onKeyPress={this.checkforEnter.bind(this)} onChange={this.processInputPurpuse.bind(this)} />
        <input type="text" placeholder={"Send Invite... "}  value={this.state.inputInvite} onKeyPress={this.checkforEnter.bind(this)} onChange={this.processInputInvite.bind(this)} />

       </div>
    </div>
  <div className= "assetList">
  {this.props.assetList.map((asset,index)=>this.createAsset(asset,index))}
</div>
  </div>
)
}
}

export default Assets
