'use strict'
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
import PDFViewer from  "mgr-pdf-viewer-react"
import Highlight from 'react-highlight'
import CandleStickChartWithMACDIndicator from './StockGraph'
import Popup from 'react-popup';

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
  result.push(<Emoji key={i} emoji={Emulti[0]} size={size}/>)

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
      togglePicker: "none"
    }
}

parseCommand(str) {
  if (!str)
    return false
  let regExp = /^!(.+)$/
  let match = str.match(regExp)

  if (match) {
      console.log("command matched",match);
      return true
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
    console.log("togglePicker: ",this.state.togglePicker);
}

processEmoji(emoji) {
  console.log(emoji);
}

mlist() {
  return (
  <div>
  {this.props.messages.sort((a,b)=>a.time - b.time).map((message,index)=>{
    let ext
    if (message.file) {
      ext = message.name.split('.').pop().toUpperCase();
    }
    if (ext = "MP3") {
      return <div>{index}{message.name}</div>
    }
  })
  }
  </div>
  )
}

createCard(message,index) {
//  console.log("createCard",message);
  if (!message.id)
    return null

  let avatar = "/avatar/user/" + message.team + "/" + message.sourceUser + ".png"
  let sound = null
  let format = "cardContent"
  let date = new Date(message.time)
  let url
  let element
  let fileExt
  let snippet
  let youtube = null
//  let formatedContent = emojify(message.content,eOptins)
  let formatedContent = parseEmulti(message.content)
  let command = this.parseCommand(message.content)

  if (command) {
    switch(command[1]) {
      case "mlist":
      return this.mlist()
      break
      default:
      console.log("create card, unkown command",command);
    }
  return
  }

  let id = this.getYouTubeId(message.content)
  if (id) {
    youtube = <div> <YouTubeVideo id={id} /></div>
  }

  if (message.file) {
    fileExt = message.name.split('.').pop().toUpperCase();
    console.log("File Extension is:",fileExt);
    url  = "https://www.onacci.com/assets/" + message.team + "/" + message.file

    switch (fileExt) {
      case "GIF":
      case "TIF":
      case "SVG":
      case "BMP":
      case "PNG":
      case "JPG":
      element =   <img  src={url}  height="200" width="300" />
      console.log("should display",url);
      break
      case "MP3":

      /* element = <audio  src={url} controls={true} width={"70%"} height={"5%"}> </audio>*/

      element = <div onClick={()=>this.props.play(url,message.name)}>{message.name}</div>
      console.log("should play sound");
      break
      case "PDF":
      element = <PDFViewer document={{url: url}} />
      break
      default:
        console.log("Unknown media file.....");
    }

  }

  if (message.subtype === "snippet") {
    element =  <Highlight className={message.lang}>{message.content}</Highlight>
    return (
      <div id = {message.id} key={message.id} className="fade-in" onClick={()=>this.props.messageSelect(message.id)}>
      <img src={avatar} alt="Avatar" className ="w3-left  w3-margin-right w3-img" ref={img => this.img = img} onError={(e)=>{e.target.src='/images/onacci.png'}} />
      <div className ="w3-panel w3-card-4 w3-margin-left tooltip" >
        <p className="cardName">{this.CL(message.sourceUser)}</p>
        <p className = "cardDate w3-margin-left tooltiptext" >{ date.toString("YY MMM dd HH MM ss")}</p>
      <div>
        {youtube}
        {element}
      </div>
        </div>
      </div>
    )
  }


  if ('timeseries' in message) {
    // Important date string must convert to date data structure otherwise CandleStickChartWithMACDIndicator will fail with xAccessor
    let timeseries = message.timeseries
    timeseries.map(item=>{item.date = new Date(item.date)})
    element = <div onClick={()=>this}><CandleStickChartWithMACDIndicator data={timeseries} width={800} ratio={1} type="svg"/></div>
  }


    if ('news' in message) {
      // Important date string must convert to date data structure otherwise CandleStickChartWithMACDIndicator will fail with xAccessor
    console.log("IN NEWS");
      let news = message.news
      element = news.map(item=>{
        return (<div>
        <h2>{item.symbol}</h2>
        <a href={item.link}>{item.title}</a>
        <h5>{item.description}</h5>
        </div>
      )
      }
      )

    }




  return  (
//  Math.random().toString(36).slice(2)
    <div id = {message.id} key={message.id} className="fade-in" onClick={()=>this.props.messageSelect(message.id)}>
    <img src={avatar} alt="Avatar" className ="w3-left  w3-margin-right w3-img" ref={img => this.img = img} onError={(e)=>{e.target.src='/images/onacci.png'}} />
    <div className ="w3-panel w3-card-4 w3-margin-left tooltip" >
      <p className="cardName">{this.CL(message.sourceUser)}</p>
      <p className={format} > <Linkify tagName="p">
          {parseEmulti(message.content)}
      </Linkify></p>
      <p className = "cardDate w3-margin-left tooltiptext" >{ date.toString("YY MMM dd HH MM ss")}</p>
    <div>
      {youtube}
      {element}
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
  {this.props.messages.sort((a,b)=>a.time - b.time).map((message,index)=>this.createCard(message,index))}
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
