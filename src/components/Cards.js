import React, { Component } from 'react';
import { Redirect } from 'react-router'
import {emojify} from 'react-emojione';
import Emojify from 'react-emojione';

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

createCard(message,index) {
  if (!message.id)
    return null

  let date = new Date(message.time)
  let formatedContent = emojify(message.content,{output: 'unicode'})
  /*console.log("debag create cards", formatedContent);
  if (!message.notifyed) {
  let mess = {type: "seen",payload: {id: message.id}}
  console.log("DEBUGG",mess);
  this.props.send(mess)
  }*/

  return  (
    <div id={index} className="fade-in">
    <img id={index} src="/images/onacci.png" alt="Avatar" className ="w3-left w3-circle w3-margin-right w3-img" />
    <div id={index} className ="w3-panel w3-card-4 w3-margin-left">
      <p className="cardName">{ this.CL(message.sourceUser) }</p>
      <p className="cardContent">{formatedContent}</p>
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
