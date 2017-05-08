import React, { Component } from 'react';
import { Redirect } from 'react-router'



class online extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      online: []
    }
    }

    createOnlineList(onlineUser,index) {
        return <li key={index} onClick={()=>this.message(onlineUser)}>{onlineUser}</li>
    }

    messageHandler(event) {
      let that = this
      console.log('Message from server', event);
      let m = JSON.parse(event.data)
      switch(m.type) {
        case "online":
        that.setState({online: m.data})
        break
         default:
         console.log("Uknown message type:",m.type)
       }
    }


    componentDidMount() {
      let that = this
      this.props.ws.addEventListener('message',this.messageHandler.bind(this))
      this.sendOnline()
    }

    componentWillUnmount() {
      console.log("Online unmounts........")
        this.props.ws.removeEventListener('message',this.messageHandler)
    }

    sendOnline() {
      this.props.ws.send(JSON.stringify({type: "online",payload: {}, session: this.props.session}))
    }

render() {

  if (this.state.auth === false)
    return <Redirect to= "/login" />

  return (
  <div className = "wrapper">
  <div className = "online">
  <ul>
  {this.state.online.map((onlineUser,i)=>this.createOnlineList(onlineUser,i))}
  </ul>
  </div>
</div>
)
}
}
