import React, { Component } from 'react';
import { Redirect } from 'react-router'
import {emojify} from 'react-emojione';
import Emojify from 'react-emojione';
import Linkify from 'linkifyjs/react';

import YouTubeVideo from './Youtube'

const eOptins = {
    convertShortnames: true,
    convertUnicode: true,
    convertAscii: true,
    style: {
        backgroundImage: 'url("/path/to/your/emojione.sprites.png")',
        height: 32,
        margin: 4,
    },
    // this click handler will be set on every emoji
    onClick: event => alert(event.target.title)
};


class Cards extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
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


createCard(message,index) {
  if (!message.id)
    return null

  let style = {display: "none"}
  let format = "cardContent"
  let date = new Date(message.time)
  let formatedContent = emojify(message.content,{output: 'unicode'})
  let id = this.getYouTubeId(message.content)
  if (id) {
    style = {display: "block"}
    format = "YouTubeLink"
  }


  return  (
// Math.random().toString(36).slice(2)
    <div key={message.id} className="fade-in">
    <img src="/images/onacci.png" alt="Avatar" className ="w3-left w3-circle w3-margin-right w3-img" />
    <div className ="w3-panel w3-card-4 w3-margin-left">
      <p className="cardName">{ this.CL(message.sourceUser) }</p>
      <p className={format}><Linkify tagName="p">{formatedContent}></Linkify></p>
      <div style={style}> <YouTubeVideo id={id} /></div>
      <p className = "cardDate">{ date.toString("YY MMM dd HH MM ss")}</p>
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
