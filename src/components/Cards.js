import React, { Component } from 'react';
import { Redirect } from 'react-router'
import {emojify} from 'react-emojione';
import Emojify from 'react-emojione';
import {Emoji} from 'emoji-mart'
import {Picker} from 'emoji-mart'
import Linkify from 'linkifyjs/react';
import Lightbox from 'react-images';
import YouTubeVideo from './Youtube'
import { emojiIndex } from 'emoji-mart'
import ReactPlayer from 'react-player'

function parseEmulti(str) {
  let match = []
  let start = -1
  let end = -1
  let i = 0
  let Emulti = []
  let parsedStr = str
  let result = []
  let size = 32

  if (!str)
    return ""
  else {
  for (i = 0; i < str.length; i++) {
    if (str[i] === ":")
      if (start === -1)
        start = i
      else {
        end = i + 1
      match.push({start,end})
      start = end = -1
    }
  }
  Emulti = match.map(pos=>{
    return str.substring(pos.start,pos.end)
  })

  //0 till start
  //end to start
  // end to str.length
  if (match.length === 1)
    size = 32
  else {
    size = 16
  }

  if (match.length > 0)
  {

  result.push(str.substring(0,match[0].start))
  result.push(<Emoji emoji={Emulti[0]} size={size}/>)

  for ( i = 1; i < match.length ; i++) {
  result.push(str.substring(match[i-1].end,match[i].start))
  result.push(<Emoji emoji={Emulti[i]} size={size}/>)
  }
  result.push(str.substring(match[match.length -1 ].end,str.length))
  return result
}
return str

}
}

const LIGHTBOX_IMAGE_SET = [
  {
    src: 'http://example.com/example/img1.jpg',
    caption: 'Sydney, Australia - Photo by Jill Smith',
  },
  {
    src: 'http://example.com/example/img2.jpg',
  }
];



const eOptins = {
  /*
    convertShortnames: true,
    convertUnicode: true,
    convertAscii: true,
    */
    style: {
        backgroundImage: 'url("/path/to/your/emojione.sprites.png")',
        height: 64,
        margin: 4,
    },
    // this click handler will be set on every emoji
    onClick: event => alert(event.target.title)
};


class Cards extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      errorImage: "",
      togglePicker: {display: "none"}
    }
}

CL(string) {
    if (string)
      return string.charAt(0).toUpperCase() + string.slice(1);
    else {
        return string
    }
}

getYouTubeId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return false;
    }
}


togglePicker() {
  if (this.state.togglePicker === "none")
    this.setState({togglePicker: "block"})
    else {
      this.setState({togglePicker: "none"})
    }
}

processEmoji(emoji) {
  console.log(emoji);
}

createCard(message,index) {
  if (!message.id)
    return null

  let avatar = "/avatar/" + message.team + "/" + message.sourceUser + ".png"
  let youTubeStyle = {display: "none"}
  let lightBoxStyle = {display: "none"}
  let soundStyle = {display: "none"}
  let format = "cardContent"
  let date = new Date(message.time)
  let image
  let sound
  let fileExt
//  let formatedContent = emojify(message.content,eOptins)
  let formatedContent = parseEmulti(message.content)
  let id = this.getYouTubeId(message.content)
  if (id) {
    youTubeStyle = {display: "block"}
    format = "YouTubeLink"
  }

  if (message.file) {
    fileExt = message.name.split('.').pop();
    console.log("File Extension is:",fileExt);
    switch (fileExt) {
      case "JPG":
      lightBoxStyle = {display: "block"}
      image  = "https://www.onacci.com/assets/" + message.team + "/" + message.file
      console.log("should display",image);
      break
      case "mp3":
      soundStyle = {display: "block"}
      sound = "https://www.onacci.com/assets/" + message.team + "/" + message.file
      console.log("should play sound");
      break
      default:
        console.log("Unknown media file.....");
    }

  }





  return  (
// Math.random().toString(36).slice(2)
    <div id = {message.id} key={message.id} className="fade-in" onClick={()=>this.props.messageSelect(message.id)}>
    <img src={avatar} alt="Avatar" className ="w3-left  w3-margin-right w3-img" ref={img => this.img = img} onError={(e)=>{e.target.src='/images/onacci.png'}} />
    <div className ="w3-panel w3-card-4 w3-margin-left">
      <p className="cardName">{ this.CL(message.sourceUser) }</p>
      <p className={format}><Linkify tagName="p">
          {parseEmulti(message.content)}
      </Linkify></p>
    <img style={lightBoxStyle} src={image}  height="200" width="300" />
      <div style={youTubeStyle}> <YouTubeVideo id={id} /></div>
      <ReactPlayer style={soundStyle} url={sound} controls={true} width={"70%"} height={"5%"}/>
      <p className = "cardDate w3-margin-left">{ date.toString("YY MMM dd HH MM ss")}</p>
      <div className="tools" style={{fload: "right"}}>
        <div onClick={()=>this.togglePicker.bind(this)}>
          <p><span className = "HomeChannelPlus" onClick={this.togglePicker.bind(this)}>&#9786;</span></p>
        </div>
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
      </div>
    </div>
  )

  }


render() {
  if (!this.props.messages)
    return <div></div>

  return (
  <div>
  {this.props.messages.map((message,index)=>this.createCard(message,index))}
  </div>
)
}
}

export default Cards

/*

<Lightbox
  images={LIGHTBOX_IMAGE_SET}
/>
*/
