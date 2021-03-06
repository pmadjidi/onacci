import React, { Component } from 'react';
import { Redirect } from 'react-router'

let MESSAGEBUFFER = []

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      team: "",
      session: null,
      checked: false,
     userMessage: "User",
     passMessage: "Password",
     teamMessage: "Team, organisation or entity"}
    this.handleUserNameChange = this.handleUserNameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleTeamChange = this.handleTeamChange.bind(this)
    this.processLoginForm = this.processLoginForm.bind(this)

  }

  getInitialState() {
  return {username: "",password: "",team: "", auth: false, passMessage: "Password"};
}


    componentDidMount() {
      console.log(this.props.ws)
      console.log(this.state)
      //setTimeout(this.getLoginFromLocalStorage.bind(this), 100)
      this.getLoginFromLocalStorage()
    }

    loginEventListner(event) {
      console.log('Message from server', event);
      let m = JSON.parse(event.data)
      console.log("Parsed message...",m)



      if (m.auth === false || m.auth === "false") {
        console.log("login failed....");
        this.setState({auth: false,passMessage: "Wrong password, retry?"})
      }

      if (m.auth === true  || m.auth === "true"){
        console.log("login sucess....")
          console.log("Setting auth user and session key and team to:", m.user,m.session,m.team)
          if (this.state.checked) {
          this.storeLogin(m.user,m.session,m.team)
          }
          this.props.onLogin(m.user,m.session,m.team)
          this.setState({auth: true})
      }
      }



    componentWillMount() {
      let that = this
      this.props.ws.addEventListener('message',this.loginEventListner.bind(this))
    }



storeLogin(name,sess,team) {
  let date = new Date().getTime()
  let token = JSON.stringify({username: name,session: sess,team: team,date: date})
  localStorage.setItem("OnacciSession",token)
}

getLoginFromLocalStorage() {
  let userInfo = localStorage.getItem("OnacciSession")
  console.log(userInfo);
  let user
  let payload
  if (userInfo) {
    user = JSON.parse(userInfo)
    payload = {type: "session",payload: {team: user.team,username: user.username,session: user.session}}
    this.send(payload)
  }
}

componentWillUnmount() {
  console.log("Login: removeEventListener....");
  this.props.ws.removeEventListener('message')
}

componentWillReceiveProps(nextProps) {
  console.log("Login: removeEventListener....");
  this.props.ws.removeEventListener('message',this.loginEventListner)
}

    processLoginForm(){
      console.log("Socket state: ",this.props.ws.readyState)
      if (this.state.team === "") {
        this.setState({teamMessage: "Team field can not be EMPTY..."})
        return
      }
      if (this.state.username === "") {
        this.setState({userMessage: "Username field can not be EMPTY..."})
        return
      }

      if (this.state.password === "") {
        this.setState({passMessage: "Password field can not be EMPTY..."})
        return
      }

      this.send({type: "login",payload: {team: this.state.team,username: this.state.username,password: this.state.password}})
    }

    handleUserNameChange(e) {
      console.log(e.target.value)
   this.setState({username: e.target.value});
}

send(message) {
  if (!this.props.ws.readyState) {
  console.log("Socket not ready, delaying one second......",message);
  return setTimeout((message) => this.send(message),1000,message)
  }
  else {
    console.log(message);
    console.log("Socket Ready... sending....",message);
    this.props.ws.send(JSON.stringify(message))
  }
}

handlePasswordChange(e) {
    console.log(e.target.value)
   this.setState({password: e.target.value});
}

handleTeamChange(e) {
    console.log(e.target.value)
   this.setState({team: e.target.value});
}

rememberMe() {
  this.setState({checked: !this.state.checked})
  console.log(this.state);
}

render() {

  if (this.state.auth === true)
    return <Redirect to= "/home" />

  return (
    <div className="fade-in">


  <div className="modal" id="id01" >
<form >
  <div className="imgcontainer">
    <img src="/images/onacci.png" alt="Avatar" className="avatar" />
  </div>

  <div className="container">

    <label><b>{this.state.teamMessage}</b></label>
      <input className = "input" type="text" placeholder="Enter Team or Organisation or Entity"  value={this.state.team} required onChange={this.handleTeamChange} />

    <label><b>{this.state.userMessage}</b></label>
    <input className = "input" type="text" placeholder="Enter Username"   value={this.state.name} required onChange={this.handleUserNameChange} />

    <label><b>{this.state.passMessage}</b></label>
    <input className = "input" type="password" placeholder="Enter Password"  value={this.state.name} required onChange={this.handlePasswordChange} />

      <button  type='button' onClick={this.processLoginForm}>Login</button>
    <input type="checkbox" checked={this.state.checked} onClick={this.rememberMe.bind(this)}/> Remember me
  </div>

  <div className="container" style={{"backgroundColor": "#f1f1f1"}}>
    <button type="button" className="cancelbtn">Cancel</button>
    <span className="psw">Forgot <a href="#">password?</a></span>
  </div>
</form>
  </div>
</div>
)
}

}

export default Login
