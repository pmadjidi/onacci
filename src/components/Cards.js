import React, { Component } from 'react';
import { Redirect } from 'react-router'



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
  let date = new Date(message.time)
  return  (
    <div id={index}>
    <img id={index} src="/images/onacci.png" alt="Avatar" className ="w3-left w3-circle w3-margin-right w3-img" />
    <div id={index} className ="w3-panel w3-card-4 w3-margin-left">
      <p>{ this.CL(message.sourceUser) }</p>
      <p>{message.content}</p>
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
