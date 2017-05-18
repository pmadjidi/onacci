import React, { Component } from 'react';
import { Redirect } from 'react-router'

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      team: "",
     userMessage: "User",
     passMessage: "Password",
     teamMessage: "Team"}
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
    }

    componentWillMount() {
      let that = this
      this.props.ws.addEventListener('message', function (event) {
    console.log('Message from server', event);
    let m = JSON.parse(event.data)
    console.log("Parsed message...",m)



    if (m.auth === false || m.auth === "false") {
      console.log("login failed....");
      that.setState({auth: false,passMessage: "Wrong password, retry?"})
    }

    if (m.auth === true  || m.auth === "true"){
      console.log("login sucess....");
        that.setState({auth: true})
        console.log("Setting auth user and session key to:", m.user,m.session)
        localStorage.setItem(m.session,m.user)
    }
    }
)}

componentWillUnmount() {
  console.log("Login: removeEventListener....");
  this.props.ws.removeEventListener('message')
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

      this.props.ws.send(JSON.stringify({type: "login",payload: {team: this.state.team,username: this.state.username,password: this.state.password}}))
    }

    handleUserNameChange(e) {
      console.log(e.target.value)
   this.setState({username: e.target.value});
}

handlePasswordChange(e) {
    console.log(e.target.value)
   this.setState({password: e.target.value});
}

handleTeamChange(e) {
    console.log(e.target.value)
   this.setState({team: e.target.value});
}



render() {

  if (this.state.auth === true)
    return <Redirect to= "/home" />

  return (
    <div>


  <div className="modal" id="id01" >
<form >
  <div className="imgcontainer">
    <img src="/images/onacci.png" alt="Avatar" className="avatar" />
  </div>

  <div className="container">

    <label><b>{this.state.teamMessage}</b></label>
      <input type="text" placeholder="Enter Team"  value={this.state.team} required onChange={this.handleTeamChange} />

    <label><b>{this.state.userMessage}</b></label>
    <input type="text" placeholder="Enter Username"   value={this.state.name} required onChange={this.handleUserNameChange} />

    <label><b>{this.state.passMessage}</b></label>
    <input type="password" placeholder="Enter Password"  value={this.state.name} required onChange={this.handlePasswordChange} />

      <button  type='button' onClick={this.processLoginForm}>Login</button>
    <input type="checkbox" checked={this.props.checked} /> Remember me
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
