import React, { Component } from 'react';
import { Redirect } from 'react-router'



class Cards extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
}


createCard(message,index) {
  return  (
    <div id={index}>
    <img src="/images/onacci.png" alt="Avatar" className ="w3-left w3-circle w3-margin-right w3-img" />
    <div className ="w3-panel w3-card-4 w3-margin-left"><p>{ message.sourceUser + ": " + message.content}</p></div>
    </div>
  )

  }

render() {
  if (!this.props.messages)
    return null

  return (
  <div>
  {this.props.messages.map((message,index)=>this.createCard(message,index))}
  </div>
)
}
}

export default Cards
